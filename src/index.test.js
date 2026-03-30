const { describe, it, after } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const app = require("./index.js");

describe("Items API", () => {
  it("should be importable", () => {
    assert.ok(app);
  });
});

describe("Hello World Endpoint", () => {
  let server;
  let baseUrl;

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it("GET /hello should return hello world message", async () => {
    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;

    const response = await fetch(`${baseUrl}/hello`);
    assert.strictEqual(response.status, 200);
    const body = await response.json();
    assert.deepStrictEqual(body, { message: "Hello, World!" });
  });
});
