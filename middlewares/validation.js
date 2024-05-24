const { validationResult, body } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/config').jwtSecret;

// validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateToken = (req, res, next) => {
  // get the token from the request headers
  const token = req.headers.authorization;

  // check if token is existent
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const actualToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(actualToken, jwtSecret);
   
    // attach the decoded user to the request
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