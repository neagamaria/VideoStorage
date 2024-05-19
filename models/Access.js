const { DataTypes } = require('sequelize');
const connection = require('../config/database');

const Access = connection.define('Access', {
  accessID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  movieID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  accountID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },  
  accessDate: {
    type: DataTypes.DATE, 
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

module.exports = Access;
