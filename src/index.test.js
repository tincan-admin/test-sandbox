const { describe, it, after } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const app = require("./index.js");

function request(server, path) {
  return new Promise((resolve, reject) => {
    const { port } = server.address();
    http.get(`http://127.0.0.1:${port}${path}`, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
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

  after(() => new Promise((resolve) => server.close(resolve)));

  it("should return 200 with status ok and a timestamp", async () => {
    server = app.listen(0);
    const before = Date.now();
    const res = await request(server, "/health");
    const after = Date.now();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, "ok");
    assert.strictEqual(typeof res.body.timestamp, "number");
    assert.ok(res.body.timestamp >= before && res.body.timestamp <= after);
  });
});
