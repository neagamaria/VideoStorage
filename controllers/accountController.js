const Account = require('../models/Account');
const User = require('../models/User');

exports.getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.findAll();
    return accounts;
  } catch (error) {
    next(error);
  }
};

exports.createAccount = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.body.userID);
    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const accountData = {
        name: req.body.name,
        type: req.body.type,
        creationDate: req.body.creationDate,
        userID: req.body.userID,
        createdAt: new Date(),
        updatedAt: new Date()
    };
     
    const account = await Account.create(accountData);
    return account;
  } catch (error) {
    next(error);
  }
};

exports.getAccountById = async (req, res, next) => {
  try {
    const account = await Account.findByPk(req.params.accountID);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    return account;
  } catch (error) {
    next(error);
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    const account = await Account.findByPk(req.params.accountID);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if(req.body.userID) {
      const user = await User.findByPk(req.body.userID);
      if(!user) {
          return res.status(404).json({ message: 'User not found' });
      }
    }

    const accountData = {
      name: req.body.name ?? account.name,
      type: req.body.type ?? account.type,
      creationDate: req.body.creationDate ?? account.creationDate,
      userID: req.body.userID ?? account.userID,
      updatedAt: new Date()
    };

    await account.update(accountData);
    return account;
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const account = await Account.findByPk(req.params.accountID);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    await account.destroy();
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};
