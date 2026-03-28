/**
 * Express error handling middleware.
 * Logs the error stack and returns an appropriate response
 * based on the current NODE_ENV.
 */
function errorHandler(err, req, res, _next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "production") {
    res.status(statusCode).json({
      error: "Internal Server Error",
      statusCode,
    });
  } else {
    res.status(statusCode).json({
      error: err.message,
      stack: err.stack,
      statusCode,
    });
  }
}

module.exports = errorHandler;
