/**
 * Hand-written JSON schema validator middleware.
 *
 * Accepts a schema object whose keys are field names and values describe
 * the expected constraints:
 *   {
 *     fieldName: {
 *       type: "string" | "number" | "boolean",
 *       required: true/false,
 *       minLength: <number>,   // strings only
 *       maxLength: <number>,   // strings only
 *       pattern: <RegExp>,     // strings only
 *     }
 *   }
 *
 * Returns Express middleware that validates req.body against the schema.
 * On failure responds with 400 and { error: "Validation failed", details: [...] }.
 */

function validate(schema) {
  return (req, res, next) => {
    const body = req.body || {};
    const details = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];

      // --- required check ---
      if (rules.required && (value === undefined || value === null || value === "")) {
        details.push({ field, message: `${field} is required` });
        continue; // skip further checks for this field
      }

      // If the field is not present and not required, skip remaining checks
      if (value === undefined || value === null) {
        continue;
      }

      // --- type check ---
      if (rules.type) {
        const actualType = typeof value;
        if (actualType !== rules.type) {
          details.push({
            field,
            message: `${field} must be of type ${rules.type}`,
          });
          continue;
        }
      }

      // --- string-specific checks ---
      if (typeof value === "string") {
        if (rules.minLength !== undefined && value.length < rules.minLength) {
          details.push({
            field,
            message: `${field} must be at least ${rules.minLength} characters`,
          });
        }

        if (rules.maxLength !== undefined && value.length > rules.maxLength) {
          details.push({
            field,
            message: `${field} must be at most ${rules.maxLength} characters`,
          });
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          details.push({
            field,
            message: `${field} has an invalid format`,
          });
        }
      }
    }

    if (details.length > 0) {
      return res.status(400).json({ error: "Validation failed", details });
    }

    next();
  };
}

module.exports = validate;
