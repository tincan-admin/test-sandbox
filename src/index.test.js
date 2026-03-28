const { describe, it, mock } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const app = require("./index.js");

function request(server, path) {
  return new Promise((resolve, reject) => {
    const url = `http://127.0.0.1:${server.address().port}${path}`;
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    }).on("error", reject);
  });
}

describe("Items API", () => {
  it("should be importable", () => {
    assert.ok(app);
  });
});

describe("GET /health", () => {
  let server;

  it("should return correct response shape with status ok", async () => {
    server = app.listen(0);
    try {
      const { status, body } = await request(server, "/health");

      assert.strictEqual(status, 200);
      assert.strictEqual(body.status, "ok");
      assert.strictEqual(typeof body.uptime, "number");
      assert.ok(body.uptime >= 0);
      assert.strictEqual(typeof body.timestamp, "string");
      assert.ok(!isNaN(Date.parse(body.timestamp)), "timestamp should be valid ISO 8601");
      assert.strictEqual(body.version, "1.0.0");
      assert.strictEqual(typeof body.memory, "number");
      assert.ok(body.memory > 0);
    } finally {
      server.close();
    }
  });

  it("should return degraded when memory exceeds 512MB", async () => {
    const originalMemoryUsage = process.memoryUsage;
    process.memoryUsage = () => ({
      ...originalMemoryUsage(),
      rss: 600 * 1024 * 1024, // 600MB
    });

    server = app.listen(0);
    try {
      const { body } = await request(server, "/health");
      assert.strictEqual(body.status, "degraded");
      assert.ok(body.memory > 512);
    } finally {
      process.memoryUsage = originalMemoryUsage;
      server.close();
    }
  });

  it("should return ok when memory is below 512MB", async () => {
    const originalMemoryUsage = process.memoryUsage;
    process.memoryUsage = () => ({
      ...originalMemoryUsage(),
      rss: 256 * 1024 * 1024, // 256MB
    });

    server = app.listen(0);
    try {
      const { body } = await request(server, "/health");
      assert.strictEqual(body.status, "ok");
      assert.ok(body.memory <= 512);
    } finally {
      process.memoryUsage = originalMemoryUsage;
      server.close();
    }
  });
});
