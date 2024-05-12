const { validationResult, body } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/config').jwtSecret;

// Generic validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateToken = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const actualToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(actualToken, jwtSecret);
   
    // Attach the decoded user information to the request object
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports = {
  validateRequest: validateRequest,
  validateToken: validateToken
};

// const validateAccessDate = body('accessDate').custom(value => {
//   // Define a regular expression pattern for datetime format (adjust as needed)
//   const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

//   // Check if the value matches the datetime pattern
//   if (!dateTimePattern.test(value)) {
//     next(new Error('Access date must be in datetime format (YYYY-MM-DDTHH:MM:SS)'));
//   }

//   // Return true if the value matches the pattern
//   return true;
// });

// module.exports = {
//   validateAccessDate
// };
