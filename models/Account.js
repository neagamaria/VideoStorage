const { DataTypes } = require('sequelize');
const connection = require('../config/database');

const Account = connection.define('Account', {
  accountID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creationDate: {
    type: DataTypes.DATEONLY, 
    allowNull: false,          
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATEONLY, 
    allowNull: false,          
  },
  updatedAt: {
    type: DataTypes.DATEONLY, 
    allowNull: false,          
  }
});

module.exports = Account;
