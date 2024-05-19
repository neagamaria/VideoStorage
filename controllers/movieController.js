const Movie = require('../models/Movie');
const MovieImage = require('../models/MovieImage');
const Category = require('../models/Category');

// all db operations use Sequelize ORM
exports.getAllMovies = async (req, res, next) => {
  try {
    // Retrieve all movies from the database
    const movies = await Movie.findAll();
    return movies;
  } catch (error) {
    next(error);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.body.categoryID);
    if(!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    const movieData = {
        name: req.body.name,
        duration: req.body.duration,
        releaseDate: req.body.releaseDate,
        cast: req.body.cast,
        categoryID: req.body.categoryID,
        createdAt: new Date(),
        updatedAt: new Date()
    };
     
    const movie = await Movie.create(movieData);
    return movie;
  } catch (error) {
    next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.movieID);
    if (!movie) {
      return null;
    }
    return movie;
  } catch (error) {
    next(error);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.movieID);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    if(req.body.categoryID) {
      const category = await Category.findByPk(req.body.categoryID);
      if(!category) {
          return res.status(404).json({ message: 'Category not found' });
      }
    }

    const movieData = {
      name: req.body.name ?? movie.name,
      duration: req.body.duration ?? movie.duration,
      releaseDate: req.body.releaseDate ?? movie.releaseDate,
      cast: req.body.cast ?? movie.cast,
      categoryID: req.body.categoryID ?? movie.categoryID,
      updatedAt: new Date()
    };

    await movie.update(movieData);
    return movie;
  } catch (error) {
    next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.movieID);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const movieImages = await MovieImage.findAll({ where: { movieID : req.params.movieID } });
      if (movieImages!=null && movieImages.length > 0) {
        return res.status(400).json({ message: 'Cannot delete movie with associated images' });
      }

    await movie.destroy();
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

//pagination for get recent movies
exports.getMoviesWithPagination = async (req, res, next) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const pageSize = parseInt(req.params.pageSize, 10) || 10;

    // Validate that page and pageSize are positive integers
    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 10;

    const offset = (page - 1) * pageSize;
    const movies = await Movie.findAndCountAll({
      offset,
      limit: pageSize,
      order: [['releaseDate', 'DESC']] 
    });
    return res.json({
      total: movies.count,
      totalPages: Math.ceil(movies.count / pageSize),
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
      movies: movies.rows
    });
  } catch (error) {
    next(error);
  }
};
