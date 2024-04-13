const express = require('express');
const app = express();
// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    // Handle validation errors
    return res.status(400).json({ message: err.message });
  } else if (err.name === 'UnauthorizedError') {
    // Handle unauthorized errors (e.g., authentication failures)
    return res.status(401).json({ message: 'Unauthorized' });
  } else {
    // Handle other types of errors (e.g., database errors)
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
});
