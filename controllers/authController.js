const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/config').jwtSecret;

// Sign-in controller
exports.signin = async (req, res, next) => {
  try {
    // Find user by email
    const user = await User.findOne({where: { email: req.body.email }});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    //const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    const isPasswordValid = (req.body.password == user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT
    const token = jwt.sign({ user: user }, jwtSecret, { expiresIn: '1h' });

    return res.status(200).json({ token });
  } catch (error) {
    next(error);
   // res.status(500).json({ message: 'An error occurred' });
  }
};
