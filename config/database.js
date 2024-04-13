const { Sequelize } = require('sequelize');
const config = require('./config');

// Create a new Sequelize instance with the database configuration
const connection = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: config.dialect,
});

// Test the database connection
connection
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });


module.exports = connection;
