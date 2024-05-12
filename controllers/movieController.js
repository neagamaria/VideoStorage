const Movie = require('../models/Movie');
const Category = require('../models/Category');

// all db operations use Sequelize ORM
exports.getAllMovies = async (req, res, next) => {
  try {
    // Retrieve all movies from the database
    const movies = await Movie.findAll();
    res.json(movies);
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
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.movieID);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
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

    const category = await Category.findByPk(req.body.categoryID);
    if(!category) {
        return res.status(404).json({ message: 'Category not found' });
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
    res.json(movie);
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
      if (movies.length > 0) {
        return res.status(400).json({ message: 'Cannot delete movie with associated images' });
      }

    await movie.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

//pagination for get recent movies
exports.getMoviesWithPagination = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    const movies = await Movie.findAndCountAll({
      offset,
      limit: pageSize,
      order: [['releaseDate', 'DESC']] 
    });
    res.json({
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
