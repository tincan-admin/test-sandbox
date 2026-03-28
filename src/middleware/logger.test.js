const { describe, it, mock } = require("node:test");
const assert = require("node:assert");
const requestLogger = require("./logger");

describe("requestLogger middleware", () => {
  it("should call next()", () => {
    const req = { method: "GET", originalUrl: "/health" };
    const res = { on: () => {} };
    const next = mock.fn();

    requestLogger(req, res, next);

    assert.strictEqual(next.mock.calls.length, 1);
  });

  it("should log in the expected format", (t, done) => {
    const req = { method: "GET", originalUrl: "/health" };
    let finishHandler;
    const res = {
      statusCode: 200,
      on(event, handler) {
        if (event === "finish") finishHandler = handler;
      },
    };
    const next = () => {};

    const original = console.log;
    console.log = mock.fn();

    requestLogger(req, res, next);

    // Simulate response finish
    finishHandler();

    const logged = console.log.mock.calls[0].arguments[0];
    console.log = original;

    // Verify format: [ISO timestamp] GET /health 200 Xms
    const pattern = /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] GET \/health 200 \d+ms$/;
    assert.match(logged, pattern);
    done();
  });
});
