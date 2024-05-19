const { DataTypes } = require('sequelize');
const connection = require('../config/database');

const MovieImage = connection.define('MovieImage', {
  movieImageID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  movieID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING, 
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

module.exports = MovieImage;
