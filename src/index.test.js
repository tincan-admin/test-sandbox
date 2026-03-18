const { describe, it } = require("node:test");
const assert = require("node:assert");
const app = require("./index.js");

describe("Items API", () => {
  it("should be importable", () => {
    assert.ok(app);
  });
});
