
// error handling middleware
const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    // handle the validation errors
    return res.status(400).json({ message: err.message });
  } else if (err.name === 'UnauthorizedError') {
    // handle unauthorized errors
    return res.status(401).json({ message: 'Unauthorized' });
  } else {
    // handle other types of errors
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = errorHandler;

