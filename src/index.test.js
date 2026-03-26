const { describe, it } = require("node:test");
const assert = require("node:assert");
const app = require("./index.js");

describe("Hello endpoint", () => {
  it("GET /hello returns hello world message", async () => {
    const server = app.listen(0);
    const { port } = server.address();
    try {
      const res = await fetch(`http://localhost:${port}/hello`);
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.deepStrictEqual(body, { message: "Hello, world!" });
    } finally {
      server.close();
    }
  });
});

describe("Items API", () => {
  it("should be importable", () => {
    assert.ok(app);
  });
});
