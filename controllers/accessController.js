const Access = require('../models/Access');
const Movie = require('../models/Movie');
const Account = require('../models/Account');

// all db operations use Sequelize ORM
exports.getAllAccesses = async (req, res, next) => {
    try {
      // retrieve all categories from the database
      const accesses = await Access.findAll();
      return accesses;
    } catch (error) {
      next(error);
    }
  };
  
  exports.createAccess = async (req, res, next) => {
    try {
      const accessData = {
        movieID: req.body.movieID,
        accountID: req.body.accountID,
        accessDate: req.body.accessDate,        
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const movie = await Movie.findByPk(req.body.movieID);
      if(!movie) {
          return res.status(404).json({ message: 'Movie not found' });
      }

      const account = await Account.findByPk(req.body.accountID);
      if(!account) {
          return res.status(404).json({ message: 'Account not found' });
      }
     
      const access = await Access.create(accessData);
      return access;
    } catch (error) {
      next(error);
    }
  };
  
  