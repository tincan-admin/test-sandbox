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

describe("GET /greet/:name", () => {
  let server;

  after(() => new Promise((resolve) => server.close(resolve)));

  it("should return a personalized greeting", async () => {
    server = app.listen(0);
    const res = await request(server, "/greet/Alice");
    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(res.body, {
      message: "Hello, Alice! Welcome to Knight.",
    });
  });
});
