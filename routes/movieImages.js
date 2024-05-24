const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const validateToken = require('../middlewares/validation').validateToken;
const validateRequest = require('../middlewares/validation').validateRequest;
const MovieImageController = require('../controllers/movieImageController');

/**
 * @swagger
 * /api/movieImages/{movieImageID}:
 *   delete:
 *     summary: Delete an image
 *     description: Delete a specific image by its ID.
 *     security: 
 *       - JWTAuth: []
 *     parameters:
 *       - in: path
 *         name: movieImageID
 *         required: true
 *         description: Numeric ID of the image to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Image deleted successfully.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:movieImageID',
  param('movieImageID').isInt().withMessage('Image ID must be an integer'),
  validateRequest,
  validateToken,
  async (req, res, next) => {
    try {
      if(req.user.email != "admin@gmail.com") {
        return res.status(401).json({ message: 'User not authorized' });
      }
      const movieImage = await MovieImageController.deleteMovieImage(req, res, next);
      if (!movieImage) {
        return res.status(404).json({ message: 'Image not found' });
      }
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;