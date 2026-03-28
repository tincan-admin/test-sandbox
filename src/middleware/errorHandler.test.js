const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const express = require("express");
const http = require("node:http");
const errorHandler = require("./errorHandler");

/**
 * Helper: create a test app with a route that throws, wired with errorHandler.
 */
function createApp() {
  const app = express();
  app.get("/error", (req, res, next) => {
    next(new Error("Something broke"));
  });
  app.use(errorHandler);
  return app;
}

/**
 * Helper: start server and make a GET request, return parsed JSON body + status.
 */
function request(app, path) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      http.get(`http://127.0.0.1:${port}${path}`, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          server.close();
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            reject(e);
          }
        });
      }).on("error", (err) => {
        server.close();
        reject(err);
      });
    });
  });
}

describe("errorHandler middleware", () => {
  let originalNodeEnv;

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  it("should return generic error in production", async () => {
    process.env.NODE_ENV = "production";
    const app = createApp();
    const { status, body } = await request(app, "/error");

    assert.strictEqual(status, 500);
    assert.strictEqual(body.error, "Internal Server Error");
    assert.strictEqual(body.statusCode, 500);
    assert.strictEqual(body.stack, undefined);
  });

  it("should return detailed error in development", async () => {
    process.env.NODE_ENV = "development";
    const app = createApp();
    const { status, body } = await request(app, "/error");

    assert.strictEqual(status, 500);
    assert.strictEqual(body.error, "Something broke");
    assert.strictEqual(body.statusCode, 500);
    assert.ok(body.stack, "stack trace should be present");
  });

  it("should return detailed error when NODE_ENV is not set", async () => {
    delete process.env.NODE_ENV;
    const app = createApp();
    const { status, body } = await request(app, "/error");

    assert.strictEqual(status, 500);
    assert.strictEqual(body.error, "Something broke");
    assert.strictEqual(body.statusCode, 500);
    assert.ok(body.stack, "stack trace should be present");
  });
});
