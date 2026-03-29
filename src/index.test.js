const { describe, it, after } = require("node:test");
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

describe("GET /timestamp", () => {
  let server;

  after(() => new Promise((resolve) => server.close(resolve)));

  it("should return a JSON object with a unix timestamp in seconds", async () => {
    server = app.listen(0);
    const before = Math.floor(Date.now() / 1000);
    const res = await request(server, "/timestamp");
    const after = Math.floor(Date.now() / 1000);

    assert.strictEqual(res.status, 200);
    assert.ok(typeof res.body.timestamp === "number", "timestamp should be a number");
    assert.ok(res.body.timestamp >= before, "timestamp should be >= request start time");
    assert.ok(res.body.timestamp <= after, "timestamp should be <= request end time");
  });
});
