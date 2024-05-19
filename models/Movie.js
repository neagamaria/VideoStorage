const { DataTypes } = require('sequelize');
const connection = require('../config/database');

const Movie = connection.define('Movie', {
  movieID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.REAL,
    allowNull: false,
  },
  releaseDate: {
    type: DataTypes.INTEGER, 
    allowNull: true,          
  },
  cast: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  categoryID: {
    type:  DataTypes.INTEGER,
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

module.exports = Movie;
