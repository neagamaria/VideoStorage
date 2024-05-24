const MovieImage = require('../models/MovieImage');
const Movie = require('../models/Movie');
const fs = require('fs').promises;
const path = require('path');
const { connection } = require('../config/database'); 


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
      transaction = await connection.transaction(); 
      const movieImage = await MovieImage.findByPk(imageId, { transaction });

      if (!movieImage) {
        throw new Error('Movie image not found');
      }

      const imagePath = path.join(__dirname, '..', movieImage.path);
      await fs.unlink(imagePath);
      await movieImage.destroy({ transaction });
      await transaction.commit();

      return { message: 'Image deleted successfully' };
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw error;
    }
};