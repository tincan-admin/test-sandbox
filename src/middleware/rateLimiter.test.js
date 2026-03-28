const { describe, it, beforeEach, afterEach, mock } = require("node:test");
const assert = require("node:assert");
const express = require("express");
const http = require("node:http");
const rateLimiter = require("./rateLimiter.js");

/**
 * Helper: create a small Express app with the rate limiter and a test route,
 * start it on an ephemeral port, and return { server, baseUrl, close }.
 */
function createApp(options) {
  const app = express();
  const mw = rateLimiter(options);
  app.use(mw);
  app.get("/test", (_req, res) => res.json({ ok: true }));

  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({
        server,
        middleware: mw,
        baseUrl: `http://127.0.0.1:${port}`,
        close: () =>
          new Promise((r) => {
            clearInterval(mw._cleanupInterval);
            server.close(r);
          }),
      });
    });
  });
}

/** Simple fetch helper using Node built-in http */
function get(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () =>
          resolve({ status: res.statusCode, headers: res.headers, body })
        );
      })
      .on("error", reject);
  });
}

describe("rateLimiter middleware", () => {
  let app;

  afterEach(async () => {
    if (app) await app.close();
  });

  it("allows requests under the limit", async () => {
    app = await createApp({ windowMs: 60000, maxRequests: 5 });

    for (let i = 0; i < 5; i++) {
      const res = await get(`${app.baseUrl}/test`);
      assert.strictEqual(res.status, 200, `Request ${i + 1} should succeed`);
    }
  });

  it("sets X-RateLimit-Remaining header", async () => {
    app = await createApp({ windowMs: 60000, maxRequests: 3 });

    const res1 = await get(`${app.baseUrl}/test`);
    assert.strictEqual(res1.headers["x-ratelimit-remaining"], "2");

    const res2 = await get(`${app.baseUrl}/test`);
    assert.strictEqual(res2.headers["x-ratelimit-remaining"], "1");

    const res3 = await get(`${app.baseUrl}/test`);
    assert.strictEqual(res3.headers["x-ratelimit-remaining"], "0");
  });

  it("returns 429 when limit is exceeded", async () => {
    app = await createApp({ windowMs: 60000, maxRequests: 2 });

    // Use up the limit
    await get(`${app.baseUrl}/test`);
    await get(`${app.baseUrl}/test`);

    // Third request should be rate-limited
    const res = await get(`${app.baseUrl}/test`);
    assert.strictEqual(res.status, 429);

    const body = JSON.parse(res.body);
    assert.strictEqual(body.error, "Too many requests");
    assert.ok(typeof body.retryAfter === "number");
    assert.ok(body.retryAfter > 0);

    // Should have Retry-After header
    assert.ok(res.headers["retry-after"]);
  });

  it("resets the window after expiry", async () => {
    app = await createApp({ windowMs: 200, maxRequests: 1 });

    // First request succeeds
    const res1 = await get(`${app.baseUrl}/test`);
    assert.strictEqual(res1.status, 200);

    // Second request is rate-limited
    const res2 = await get(`${app.baseUrl}/test`);
    assert.strictEqual(res2.status, 429);

    // Wait for the window to expire
    await new Promise((r) => setTimeout(r, 300));

    // Request after window reset should succeed
    const res3 = await get(`${app.baseUrl}/test`);
    assert.strictEqual(res3.status, 200);
  });

  it("cleans up expired entries", async () => {
    app = await createApp({ windowMs: 100, maxRequests: 10 });

    // Make a request to create an entry
    await get(`${app.baseUrl}/test`);
    assert.ok(app.middleware._hits.size > 0, "should have entries in the map");

    // Wait for cleanup interval to fire
    await new Promise((r) => setTimeout(r, 250));

    assert.strictEqual(
      app.middleware._hits.size,
      0,
      "expired entries should be cleaned up"
    );
  });
});
