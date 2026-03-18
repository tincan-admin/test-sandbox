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

  it("PUT /items/:id should update an existing item", async () => {
    // Create an item first
    const createRes = await fetch(`${baseUrl}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Original" }),
    });
    const created = await createRes.json();
    assert.strictEqual(createRes.status, 201);

    // Update the item
    const updateRes = await fetch(`${baseUrl}/items/${created.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Updated" }),
    });
    const updated = await updateRes.json();
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updated.id, created.id);
    assert.strictEqual(updated.name, "Updated");
  });

  it("PUT /items/:id should return 404 for non-existent item", async () => {
    const res = await fetch(`${baseUrl}/items/99999`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Nope" }),
    });
    assert.strictEqual(res.status, 404);
  });

  it("PUT /items/:id should return 400 if name is missing", async () => {
    // Create an item first
    const createRes = await fetch(`${baseUrl}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test" }),
    });
    const created = await createRes.json();

    const res = await fetch(`${baseUrl}/items/${created.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.strictEqual(res.status, 400);
  });
});
