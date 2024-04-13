const User = require('../models/User');
// const Account = require('../models/Account');

// all db operations use Sequelize ORM
exports.getAllUsers = async (req, res, next) => {
  try {
    // Retrieve all users from the database
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // new data included in body JSON
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userID = req.params.userID;

    // // check if there are any associated accounts for the user
    // const associatedAccounts = await Account.findAll({ where: { userID } });
    // if (associatedAccounts.length > 0) {
    //   return res.status(400).json({ message: 'Cannot delete user with associated accounts' });
    // }

    await user.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
