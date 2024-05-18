const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const validateRequest = require('../middlewares/validation').validateRequest;
const validateToken = require('../middlewares/validation').validateToken;
const UserController = require('../controllers/userController');


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     security: 
 *       - JWTAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error.
 */
router.get('/', 
validateToken,
async (req, res, next) => {
  try {
    if(req.user.email != "admin@gmail.com") {
      return res.status(401).json({ message: 'User not authorized' });
    }
    const users = await UserController.getAllUsers(req, res, next);
    return res.status(200).json(users);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

/**
 * @swagger
 * /api/users/{userID}:
 *   get:
 *     summary: Get a specific user
 *     description: Retrieve details of a specific user by their ID.
 *     security: 
 *       - JWTAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Details of the requested user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:userID',
  param('userID').isInt().withMessage('User ID must be an integer'),
  validateRequest,
  validateToken,
  async (req, res, next) => {
    try {
      if(req.user.userID != req.params.userID && req.user.email != "admin@gmail.com") {
        return res.status(401).json({ message: 'User not authorized' });
      }
      const user = await UserController.getUserById(req, res, next);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  }
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided details.
 *     security: 
 *       - JWTAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: User created successfully.
 *       500:
 *         description: Internal server error.
 */
router.post('/', 
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('birthDate').notEmpty().withMessage('Birth date is required'),
  body('birthDate').isISO8601().withMessage('Invalid birth date format. Use YYYY-MM-DD format.'),
  body('birthDate').isAfter('1900-01-01').withMessage('Invalid birth date.'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest, //custom validation middleware
  async (req, res, next) => {
    try {
      const user = await UserController.createUser(req, res, next);
      return res.status(201).json(user);
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  }
);

/**
 * @swagger
 * /api/users/{userID}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a specific user by their ID.
 *     security: 
 *       - JWTAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         description: Numeric ID of the user to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:userID',
  param('userID').isInt().withMessage('User ID must be an integer'),
  validateRequest,
  validateToken,
  async (req, res, next) => {
    try {
      if(req.user.userID != req.params.userID && req.user.email != "admin@gmail.com") {
        return res.status(401).json({ message: 'User not authorized' });
      }
      const user = await UserController.deleteUser(req, res, next);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(204).end();
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  }
);

/**
 * @swagger
 * /api/users/{userID}:
 *   put:
 *     summary: Update a user
 *     description: Update the details of a specific user by their ID.
 *     security: 
 *       - JWTAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         description: Numeric ID of the user to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       500:
 *         description: Internal server error.
 */
router.put('/:userID',
  param('userID').isInt().withMessage('User ID must be an integer'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email address'),
  body('birthDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid birth date format. Use YYYY-MM-DD format.'),
  body('birthDate').optional({ checkFalsy: true }).isAfter('1900-01-01').withMessage('Invalid birth date.'),
  validateRequest,
  validateToken,
  async (req, res, next) => {
    try {
      if(req.user.userID != req.params.userID && req.user.email != "admin@gmail.com") {
        return res.status(401).json({ message: 'User not authorized' });
      }
      const user = await UserController.updateUser(req, res, next);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  }
);

module.exports = router;

