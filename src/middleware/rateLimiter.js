/**
 * In-memory rate limiter middleware per IP address.
 *
 * @param {Object} options
 * @param {number} [options.windowMs=60000]   - Time window in milliseconds.
 * @param {number} [options.maxRequests=100]  - Max requests allowed per window.
 * @returns {Function} Express middleware
 */
function rateLimiter({ windowMs = 60000, maxRequests = 100 } = {}) {
  const hits = new Map(); // ip -> { count, resetTime }

  // Periodically clean up expired entries to prevent memory leaks
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
      if (now >= entry.resetTime) {
        hits.delete(ip);
      }
    }
  }, windowMs);

  // Allow the timer to not keep the process alive
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  function middleware(req, res, next) {
    const ip = req.ip;
    const now = Date.now();

    let entry = hits.get(ip);

    // If no entry or window has expired, start a fresh window
    if (!entry || now >= entry.resetTime) {
      entry = { count: 0, resetTime: now + windowMs };
      hits.set(ip, entry);
    }

    entry.count += 1;

    const remaining = Math.max(0, maxRequests - entry.count);
    res.setHeader("X-RateLimit-Remaining", remaining);

    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      return res.status(429).json({
        error: "Too many requests",
        retryAfter,
      });
    }

    next();
  }

  // Expose internals for testing / cleanup
  middleware._hits = hits;
  middleware._cleanupInterval = cleanupInterval;

  return middleware;
}

module.exports = rateLimiter;
