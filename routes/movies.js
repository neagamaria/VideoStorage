const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, param, validationResult } = require('express-validator');
const validateToken = require('../middlewares/validation').validateToken;
const validateRequest = require('../middlewares/validation').validateRequest;
const MovieController = require('../controllers/movieController');
const MovieImageController = require('../controllers/movieImageController');


/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     description: Retrieve a list of all movies.
 *     responses:
 *       200:
 *         description: A list of movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal server error.
 */
router.get('/', 
  async (req, res, next) => {
  try {
    const movies = await MovieController.getAllMovies(req, res, next);
    return res.status(200).json(movies);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

/**
 * @swagger
 * /api/movies/{movieID}:
 *   get:
 *     summary: Get a specific movie
 *     description: Retrieve details of a specific movie by its ID.
 *     parameters:
 *       - in: path
 *         name: movieID
 *         required: true
 *         description: Numeric ID of the movie to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Details of the requested movie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:movieID',
  param('movieID').isInt().withMessage('Movie ID must be an integer'),
  validateRequest,
  async (req, res, next) => {
    try {
      const movie = await MovieController.getMovieById(req, res, next);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      return res.status(200).json(movie);
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  }
);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     description: Create a new movie with the provided details.
 *     security: 
 *       - JWTAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewMovie'
 *     responses:
 *       201:
 *         description: Movie created successfully.
 *       500:
 *         description: Internal server error.
 */
router.post('/', 
  body('name').notEmpty().withMessage('Name is required'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('releaseDate').notEmpty().withMessage('Release date is required'),
  body('releaseDate').isInt().withMessage('Invalid release date format. Use YYYY format.'),
  validateRequest, //custom validation middleware
  validateToken,
  async (req, res, next) => {
    try {
      if(req.user.email != "admin@gmail.com") {
        return res.status(401).json({ message: 'User not authorized' });
      }
      const movie = await MovieController.createMovie(req, res, next);
      return res.status(201).json(movie);
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  }
);

/**
 * @swagger
 * /api/movies/{movieID}:
 *   delete:
 *     summary: Delete a movie
 *     description: Delete a specific movie by its ID.
 *     security: 
 *       - JWTAuth: []
 *     parameters:
 *       - in: path
 *         name: movieID
 *         required: true
 *         description: Numeric ID of the movie to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie deleted successfully.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:movieID',
  param('movieID').isInt().withMessage('Movie ID must be an integer'),
  validateRequest,
  validateToken,
  async (req, res, next) => {
    try {
      if(req.user.email != "admin@gmail.com") {
        return res.status(401).json({ message: 'User not authorized' });
      }
      const movie = await MovieController.deleteMovie(req, res, next);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      return res.status(204).end();
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  }
);

/**
 * @swagger
 * /api/movies/{movieID}:
 *   put:
 *     summary: Update a movie
 *     description: Update the details of a specific movie by its ID.
 *     security: 
 *       - JWTAuth: []
 *     parameters:
 *       - in: path
 *         name: movieID
 *         required: true
 *         description: Numeric ID of the movie to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMovie'
 *     responses:
 *       200:
 *         description: Movie updated successfully.
 *       500:
 *         description: Internal server error.
 */
router.put('/:movieID',
  param('movieID').isInt().withMessage('Movie ID must be an integer'),
  param('categoryID').optional({ checkFalsy: true }).isInt().withMessage('Category ID must be an integer'),
  body('releaseDate').optional({ checkFalsy: true }).isInt().withMessage('Invalid release date format. Use YYYY format.'),
  validateRequest,
  validateToken,
  async (req, res, next) => {
    try {
      if(req.user.email != "admin@gmail.com") {
        return res.status(401).json({ message: 'User not authorized' });
      }
      const movie = await MovieController.updateMovie(req, res, next);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      return res.status(200).json(movie);
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  }
);

/**
 * @swagger
 * /api/movies/pagination/{page}/{pageSize}:
 *   get:
 *     summary: Get all movies with pagination, order by most recent first
 *     description: Retrieve a list of all movies.
 *     parameters:
 *       - in: path
 *         name: page
 *         required: false
 *         description: Page number to be returned.
 *         schema:
 *           type: integer
  *       - in: path
 *         name: pageSize
 *         required: false
 *         description: Page size .
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A paginated list of movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal server error.
 */
router.get('/pagination/:page/:pageSize', 
param('page').isInt().withMessage('Page must be an integer'),
param('pageSize').isInt().withMessage('Page size must be an integer'),
validateRequest,
async (req, res, next) => {
  try {
    const movies = await MovieController.getMoviesWithPagination(req, res, next);
    return res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
});

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/') // Destination folder where images will be stored
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // Generate unique filename
  }
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/movies/{movieID}/images:
 *   post:
 *     summary: Upload an image for a movie
 *     description: Upload an image file for a specific movie.
 *     security: 
 *       - JWTAuth: []
 *     parameters:
 *       - in: path
 *         name: movieID
 *         required: true
 *         description: ID of the movie to upload the image for.
 *         schema:
 *           type: integer
  *       - in: formData
 *         name: image
 *         required: true
 *         description: The image file to upload.
 *         schema:
 *           type: file 
 *     responses:
 *       200:
 *          description: Image uploaded successfully.
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 filename:
 *                   type: string
 *                 path:
 *                   type: string
 *       500:
 *         description: Internal server error.
 */
router.post('/:movieID/images', 
  param('movieID').isInt().withMessage('Movie ID must be an integer'),
  validateRequest,
  validateToken,
  upload.single('image'), async (req, res, next) => {
      try {
        if(req.user.email != "admin@gmail.com") {
          return res.status(401).json({ message: 'User not authorized' });
        }
        const {fileName, path} = req.file;
        req.body.path = path;

        const movieImage = await MovieImageController.uploadImage(req, res, next);
        return res.status(200).json({ message: 'Image uploaded successfully', movieImage });
      } catch (error) {
        next(error);
      }
});

/**
 * @swagger
 * /api/movies/{movieID}/images:
 *   get:
 *     summary: Get all movie images
 *     description: Retrieve a list of all images for a specified movie.
 *     parameters:
 *       - in: path
 *         name: movieID
 *         required: true
 *         description: ID of the movie to get the images for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of movie images.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MovieImage'
 *       500:
 *         description: Internal server error.
 */
router.get('/:movieId/images', 
  param('movieID').isInt().withMessage('Movie ID must be an integer'),
  validateRequest,
  async (req, res, next) => {
  try {
    const movieImages = await MovieImageController.getAllMovieImages(req, res, next);
    return res.status(200).json(movieImages);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

