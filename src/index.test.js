const { describe, it, after } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const app = require("./index.js");

function request(server, method, path) {
  return new Promise((resolve, reject) => {
    const url = `http://127.0.0.1:${server.address().port}${path}`;
    const req = http.request(url, { method }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        resolve({ status: res.statusCode, body: JSON.parse(body) });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

describe("Items API", () => {
  it("should be importable", () => {
    assert.ok(app);
  });
});

describe("GET /health", () => {
  let server;

  after(() => {
    if (server) server.close();
  });

  it("should return 200 with { status: 'ok' }", async () => {
    server = app.listen(0);
    const res = await request(server, "GET", "/health");
    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(res.body, { status: "ok" });
  });
});
