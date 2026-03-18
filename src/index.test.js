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

  it("PATCH /items/:id should return 404 for non-existent item", async () => {
    const res = await fetch(`${baseUrl}/items/999`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "updated" }),
    });
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.error, "Not found");
  });

  it("PATCH /items/:id should update the name of an existing item", async () => {
    // Create an item first
    const createRes = await fetch(`${baseUrl}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "original" }),
    });
    assert.strictEqual(createRes.status, 201);
    const created = await createRes.json();

    // Patch the item
    const patchRes = await fetch(`${baseUrl}/items/${created.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "updated" }),
    });
    assert.strictEqual(patchRes.status, 200);
    const patched = await patchRes.json();
    assert.strictEqual(patched.id, created.id);
    assert.strictEqual(patched.name, "updated");
  });

  it("PATCH /items/:id should return item unchanged when no name provided", async () => {
    // Create an item first
    const createRes = await fetch(`${baseUrl}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "no-change" }),
    });
    const created = await createRes.json();

    // Patch without name
    const patchRes = await fetch(`${baseUrl}/items/${created.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.strictEqual(patchRes.status, 200);
    const patched = await patchRes.json();
    assert.strictEqual(patched.name, "no-change");
  });
});
