const { DataTypes } = require('sequelize');
const connection = require('../config/database');

const Category = connection.define('Category', {
    categoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
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
  
  module.exports = Category;
  