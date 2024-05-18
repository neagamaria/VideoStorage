const MovieImage = require('../models/MovieImage');
const Movie = require('../models/Movie');
const fs = require('fs').promises;
const path = require('path');
const { connection } = require('../config/database'); // Import the sequelize instance


exports.uploadImage = async (req, res, next) => {
    try {
        const movie = await Movie.findByPk(req.params.movieID);
        if(!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
    
        const movieImageData = {
            path: req.body.path,
            movieID: req.params.movieID,
            createdAt: new Date(),
            updatedAt: new Date()
        };
         
        const movieImage = await MovieImage.create(movieImageData);
        return movieImage;
      } catch (error) {
        next(error);
      }
};

exports.getAllMovieImages = async (req, res, next) => {
    try {
      const movieImages = await MovieImage.findAll({
        where : { movieID: req.params.movieID }
      });
      return movieImages;
    } catch (error) {
      next(error);
    }
 };
 
exports.deleteMovieImage = async (req, res, next) => {
    let transaction;
    try {
      transaction = await connection.transaction(); // Start a transaction

      // Find the movie image by its ID
      const movieImage = await MovieImage.findByPk(imageId, { transaction });

      // If the movie image doesn't exist, rollback the transaction
      if (!movieImage) {
        throw new Error('Movie image not found');
      }

      // Construct the path to the movie image file
      const imagePath = path.join(__dirname, '..', movieImage.path);

      // Delete the movie image file from the filesystem
      await fs.unlink(imagePath);

      // Delete the movie image record from the database within the transaction
      await movieImage.destroy({ transaction });

      // Commit the transaction
      await transaction.commit();

      return { message: 'Image deleted successfully' };
    } catch (error) {
      // If an error occurs, rollback the transaction
      if (transaction) {
        await transaction.rollback();
      }
      throw error;
    }
};