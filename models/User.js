const { DataTypes } = require('sequelize');
const connection = require('../config/database');

const User = connection.define('User', {
  userID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  birthDate: {
    type: DataTypes.DATEONLY, 
    allowNull: true,          
  },
  phoneNumber: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
});

module.exports = User;
