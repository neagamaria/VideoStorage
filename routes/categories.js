const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const validateToken = require('../middlewares/validation').validateToken;
const validateRequest = require('../middlewares/validation').validateRequest;
const CategoryController = require('../controllers/categoryController');


/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error.
 */
router.get('/', 
  async (req, res, next) => {
  try {
    const categories = await CategoryController.getAllCategories(req, res, next);
    console.log(categories);
    return res.status(200).json(categories);
  } catch (error) {
    next(error); 
  }
});

/**
 * @swagger
 * /api/categories/{categoryID}:
 *   get:
 *     summary: Get a specific category
 *     description: Retrieve details of a specific category by its ID.
 *     parameters:
 *       - in: path
 *         name: categoryID
 *         required: true
 *         description: Numeric ID of the category to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Details of the requested category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:categoryID',
  param('categoryID').isInt().withMessage('Category ID must be an integer'),
  validateRequest,
  async (req, res, next) => {
    try {
      const category = await CategoryController.getCategoryById(req, res, next);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      return res.status(200).json(category);
    } catch (error) {
      next(error); 
    }
  }
);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     description: Create a new category with the provided details.
 *     security: 
 *       - JWTAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewCategory'
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       500:
 *         description: Internal server error.
 */
router.post('/', 
  body('name').notEmpty().withMessage('Name is required'),
  validateRequest,
  validateToken,
  async (req, res, next) => {
    try {
      if(req.user.email != "admin@gmail.com") {
        return res.status(401).json({ message: 'User not authorized' });
      }
      const category = await CategoryController.createCategory(req, res, next);
      return res.status(201).json(category);
    } catch (error) {
      next(error); 
    }
  }
);

/**
 * @swagger
 * /api/categories/{categoryID}:
 *   delete:
 *     summary: Delete a category
 *     description: Delete a specific category by their ID.
 *     security: 
 *       - JWTAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryID
 *         required: true
 *         description: Numeric ID of the category to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:categoryID',
  param('categoryID').isInt().withMessage('Category ID must be an integer'),
  validateRequest,
  validateToken,
  async (req, res, next) => {
    try {
      if(req.user.email != "admin@gmail.com") {
        return res.status(401).json({ message: 'User not authorized' });
      }
      const category = await CategoryController.deleteCategory(req, res, next);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      return res.status(204).end();
    } catch (error) {
      next(error); 
    }
  }
);

/**
 * @swagger
 * /api/categories/{categoryID}:
 *   put:
 *     summary: Update a category
 *     description: Update the details of a specific category by their ID.
 *     security: 
 *       - JWTAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryID
 *         required: true
 *         description: Numeric ID of the category to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategory'
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *       500:
 *         description: Internal server error.
 */
router.put('/:categoryID',
  param('categoryID').isInt().withMessage('Category ID must be an integer'),
  validateRequest,
  validateToken,
  async (req, res, next) => {
    try {
      const category = await CategoryController.updateCategory(req, res, next);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      return res.status(200).json(category);
    } catch (error) {
      next(error); 
    }
  }
);

module.exports = router;

