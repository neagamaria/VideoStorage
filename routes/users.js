const express = require('express');
const connection = require('../db_connection');
const router = express.Router();
const util = require('util');

// promisify the query method because mysql doesn't support promises
connection.query = util.promisify(connection.query).bind(connection);

// get all users in the database
router.get('/index', async (req, res, next) => {
    try {
      const results = await connection.query('SELECT * FROM user');
      res.json(results);
    } catch (error) {
      next(error);
    }
  });

  module.exports = router;