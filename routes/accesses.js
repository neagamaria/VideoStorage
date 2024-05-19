const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const validateRequest = require('../middlewares/validation').validateRequest;
const validateToken = require('../middlewares/validation').validateToken;
const AccessController = require('../controllers/accessController');


/**
 * @swagger
 * /api/accesses:
 *   get:
 *     summary: Get all accesses
 *     description: Retrieve a list of all accesses.
 *     security: 
 *       - JWTAuth: []
 *     responses:
 *       200:
 *         description: A list of accesses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Access'
 *       500:
 *         description: Internal server error.
 */
router.get('/', 
  async (req, res, next) => {
  try {
    const accesses = await AccessController.getAllAccesses(req, res, next);
    return res.status(200).json(accesses);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

/**
 * @swagger
 * /api/accesses:
 *   post:
 *     summary: Create a new access
 *     description: Create a new access with the provided details.
 *     security: 
 *       - JWTAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewAccess'
 *     responses:
 *       201:
 *         description: Access created successfully.
 *       500:
 *         description: Internal server error.
 */
router.post('/', 
  body('movieID').notEmpty().withMessage('Movie ID is required'),
  body('accountID').notEmpty().withMessage('Account ID is required'),
  body('accessDate').notEmpty().withMessage('Access date is required'),   
  body('accessDate').isISO8601().withMessage('Invalid access date format. Use YYYY-MM-DD hh:mm:ss format.'),   
  validateRequest, //custom validation middleware
  validateToken,
  async (req, res, next) => {
    try {
      const access = await AccessController.createAccess(req, res, next);
      return res.status(201).json(access);
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  }
);

module.exports = router;

