const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const validateRequest = require('../middlewares/validation').validateRequest;
const validateToken = require('../middlewares/validation').validateToken;
const AccountController = require('../controllers/accountController');


/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all accounts
 *     description: Retrieve a list of all accounts.
 *     security: 
 *       - JWTAuth: []
 *     responses:
 *       200:
 *         description: A list of accounts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
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
    const accounts = await AccountController.getAllAccounts(req, res, next);
    return res.status(200).json(accounts);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

/**
 * @swagger
 * /api/accounts/{accountID}:
 *   get:
 *     summary: Get a specific account
 *     description: Retrieve details of a specific account by its ID.
 *     security: 
 *       - JWTAuth: []
 *     parameters:
 *       - in: path
 *         name: accountID
 *         required: true
 *         description: Numeric ID of the account to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Details of the requested account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       404:
 *         description: Account not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:accountID',
  param('accountID').isInt().withMessage('Account ID must be an integer'),
  validateRequest,
  validateToken,
  async (req, res, next) => {
    try {
      const account = await AccountController.getAccountById(req, res, next);
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }
      if(req.user.userID != account.userID && req.user.email != "admin@gmail.com") {
        return res.status(401).json({ message: 'User not authorized' });
      }
      return res.status(200).json(account);
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  }
);

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new account
 *     description: Create a new account with the provided details.
 *     security: 
 *       - JWTAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewAccount'
 *     responses:
 *       201:
 *         description: Account created successfully.
 *       500:
 *         description: Internal server error.
 */
router.post('/', 
  body('name').notEmpty().withMessage('Name is required'),
  body('type').notEmpty().withMessage('Type is required'),
  body('creationDate').notEmpty().withMessage('Creation date is required'),
  body('userID').notEmpty().withMessage('User ID is required'),
  validateRequest, //custom validation middleware
  validateToken,
  async (req, res, next) => {
    try {
      if(req.user.email != "admin@gmail.com" && req.user.userID != req.body.userID) {
        return res.status(401).json({ message: 'User not authorized' });
      }
      const account = await AccountController.createAccount(req, res, next);
      return res.status(201).json(account);
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  }
);

/**
 * @swagger
 * /api/account/{accountID}:
 *   delete:
 *     summary: Delete an account
 *     description: Delete a specific account by its ID.
 *     security: 
 *       - JWTAuth: []
 *     parameters:
 *       - in: path
 *         name: accountID
 *         required: true
 *         description: Numeric ID of the account to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Account deleted successfully.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:accountID',
  param('accountID').isInt().withMessage('Account ID must be an integer'),
  validateRequest,
  validateToken,
  async (req, res, next) => {
    try {
      if(req.user.email != "admin@gmail.com") {
        return res.status(401).json({ message: 'User not authorized' });
      }
      const account = await AccountController.deleteAccount(req, res, next);
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }
      return res.status(204).end();
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  }
);

/**
 * @swagger
 * /api/accounts/{accountID}:
 *   put:
 *     summary: Update an account
 *     description: Update the details of a specific account by its ID.
 *     security: 
 *       - JWTAuth: []
 *     parameters:
 *       - in: path
 *         name: accountID
 *         required: true
 *         description: Numeric ID of the account to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAccount'
 *     responses:
 *       200:
 *         description: Account updated successfully.
 *       500:
 *         description: Internal server error.
 */
router.put('/:accountID',
  param('accountID').isInt().withMessage('Account ID must be an integer'),
  body('creationDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid creation date format. Use YYYY-MM-DD format.'),
  validateRequest,
  validateToken,
  async (req, res, next) => {
    try {
      if(req.user.email != "admin@gmail.com" && req.user.userID != req.body.userID) {
        return res.status(401).json({ message: 'User not authorized' });
      }
      const account = await AccountController.updateAccount(req, res, next);
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }
      return res.status(200).json(account);
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  }
);

module.exports = router;

