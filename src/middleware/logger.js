/**
 * Request logging middleware.
 * Logs: [timestamp] METHOD /path STATUS TIMEms
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
    console.log(line);
  });

  next();
}

module.exports = requestLogger;
