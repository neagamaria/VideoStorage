const express = require('express');
const { body, param, validationResult } = require('express-validator');
const validateRequest = require('../middlewares/validation').validateRequest;
const AuthController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Log in with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: A jwt token.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       404:
 *         description: User not found.
 *       401:
 *         description: Invalid password.
 *       500:
 *         description: An error occurred / Internal server error.
 */
router.post('/login',
  // Validation middleware using express-validator
  body('email').notEmpty().withMessage('Email is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest,
  async (req, res, next) => {
    try {
      const token = await AuthController.signin(req, res, next);    
      res.status(200).json(token);
    } catch (error) {
      next(error); 
    }
  }
);

module.exports = router;
