const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const app = require("../index.js");

/**
 * Helper: sends a request to the test server and returns { status, body }.
 */
function request(server, method, path, body) {
  return new Promise((resolve, reject) => {
    const { port } = server.address();
    const options = {
      hostname: "127.0.0.1",
      port,
      path,
      method,
      headers: { "Content-Type": "application/json" },
    };
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });
    req.on("error", reject);
    if (body !== undefined) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

describe("Validation middleware – POST /users", () => {
  let server;

  before(() => {
    return new Promise((resolve) => {
      server = app.listen(0, "127.0.0.1", resolve);
    });
  });

  after(() => {
    return new Promise((resolve) => {
      server.close(resolve);
    });
  });

  // --- Valid input passes ---
  it("should accept valid input and create a user", async () => {
    const res = await request(server, "POST", "/users", {
      name: "Alice",
      email: "alice@example.com",
    });
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.id);
    assert.strictEqual(res.body.name, "Alice");
    assert.strictEqual(res.body.email, "alice@example.com");
  });

  // --- Missing fields return 400 ---
  it("should return 400 when name is missing", async () => {
    const res = await request(server, "POST", "/users", {
      email: "bob@example.com",
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, "Validation failed");
    const nameError = res.body.details.find((d) => d.field === "name");
    assert.ok(nameError, "expected a detail entry for name");
  });

  it("should return 400 when email is missing", async () => {
    const res = await request(server, "POST", "/users", {
      name: "Bob",
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, "Validation failed");
    const emailError = res.body.details.find((d) => d.field === "email");
    assert.ok(emailError, "expected a detail entry for email");
  });

  it("should return 400 with details for both fields when body is empty", async () => {
    const res = await request(server, "POST", "/users", {});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, "Validation failed");
    assert.strictEqual(res.body.details.length, 2);
    const fields = res.body.details.map((d) => d.field).sort();
    assert.deepStrictEqual(fields, ["email", "name"]);
  });

  // --- Invalid formats return 400 with details ---
  it("should return 400 when name is not a string", async () => {
    const res = await request(server, "POST", "/users", {
      name: 123,
      email: "test@example.com",
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, "Validation failed");
    const nameError = res.body.details.find((d) => d.field === "name");
    assert.ok(nameError, "expected a detail entry for name");
    assert.ok(nameError.message.includes("type"));
  });

  it("should return 400 when email lacks @", async () => {
    const res = await request(server, "POST", "/users", {
      name: "Charlie",
      email: "not-an-email",
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, "Validation failed");
    const emailError = res.body.details.find((d) => d.field === "email");
    assert.ok(emailError, "expected a detail entry for email");
    assert.ok(emailError.message.includes("invalid format"));
  });

  it("should return 400 when name exceeds maxLength", async () => {
    const res = await request(server, "POST", "/users", {
      name: "a".repeat(101),
      email: "long@example.com",
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, "Validation failed");
    const nameError = res.body.details.find((d) => d.field === "name");
    assert.ok(nameError, "expected a detail entry for name");
  });
});
