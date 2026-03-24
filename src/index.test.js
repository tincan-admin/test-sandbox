const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const app = require("./index.js");

describe("Items API", () => {
  let server;
  let baseUrl;

  before((_, done) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  after((_, done) => {
    server.close(done);
  });

  it("should be importable", () => {
    assert.ok(app);
  });

  describe("PATCH /items/:id", () => {
    it("should return 404 for non-existent item", async () => {
      const res = await fetch(`${baseUrl}/items/9999`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "updated" }),
      });
      assert.strictEqual(res.status, 404);
      const body = await res.json();
      assert.strictEqual(body.error, "Not found");
    });

    it("should partially update name only", async () => {
      // Create an item first
      const createRes = await fetch(`${baseUrl}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Original", price: 10 }),
      });
      const created = await createRes.json();

      // Patch only the name
      const patchRes = await fetch(`${baseUrl}/items/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Updated" }),
      });
      assert.strictEqual(patchRes.status, 200);
      const patched = await patchRes.json();
      assert.strictEqual(patched.name, "Updated");
      assert.strictEqual(patched.price, 10);
      assert.strictEqual(patched.id, created.id);
    });

    it("should partially update price only", async () => {
      const createRes = await fetch(`${baseUrl}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "PriceTest", price: 5 }),
      });
      const created = await createRes.json();

      const patchRes = await fetch(`${baseUrl}/items/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: 99 }),
      });
      assert.strictEqual(patchRes.status, 200);
      const patched = await patchRes.json();
      assert.strictEqual(patched.name, "PriceTest");
      assert.strictEqual(patched.price, 99);
    });

    it("should update both name and price", async () => {
      const createRes = await fetch(`${baseUrl}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "BothTest", price: 1 }),
      });
      const created = await createRes.json();

      const patchRes = await fetch(`${baseUrl}/items/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "BothUpdated", price: 50 }),
      });
      assert.strictEqual(patchRes.status, 200);
      const patched = await patchRes.json();
      assert.strictEqual(patched.name, "BothUpdated");
      assert.strictEqual(patched.price, 50);
    });
  });
});
