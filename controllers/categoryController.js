const Category = require('../models/Category');
const Movie = require('../models/Movie');

// all db operations use Sequelize ORM
exports.getAllCategories = async (req, res, next) => {
    try {
      // Retrieve all categories from the database
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };
  
  exports.createCategory = async (req, res, next) => {
    try {
      const categoryData = {
        name: req.body.name,
        description: req.body.description,
        createdAt: new Date(),
        updatedAt: new Date()
      };
     
      const category = await Category.create(categoryData);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };
  
  exports.getCategoryById = async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.categoryID);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  };
  
  exports.updateCategory = async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.categoryID);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      const categoryData = {
        name: req.body.name ?? category.name,
        description: req.body.email ?? category.email,
        updatedAt: new Date()
      };
  
      await category.update(categoryData);
      res.json(category);
    } catch (error) {
      next(error);
    }
  };
  
  exports.deleteCategory = async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.categoryID);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      const movies = await Movie.findAll({ where: { categoryID : req.params.categoryID } });
      if (movies.length > 0) {
        return res.status(400).json({ message: 'Cannot delete category with associated movies' });
      }
  
      await category.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
  