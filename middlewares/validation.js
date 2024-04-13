const { validationResult, body } = require('express-validator');

// Generic validation middleware
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateAccessDate = body('accessDate').custom(value => {
  // Define a regular expression pattern for datetime format (adjust as needed)
  const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

  // Check if the value matches the datetime pattern
  if (!dateTimePattern.test(value)) {
    throw new Error('Access date must be in datetime format (YYYY-MM-DDTHH:MM:SS)');
  }

  // Return true if the value matches the pattern
  return true;
});

module.exports = {
  validateAccessDate
};
