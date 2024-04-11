var express = require('express');
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var swaggerUi = require("swagger-ui-express");
//@ts-ignore
var swaggerJsdoc = require("swagger-jsdoc");

// database connection
const db = require('./db_connection');

var app = express();

app.get('/', function(req, res) {
 res.send('Hello Express');
});

const usersRouter = require('./routes/users');

app.use('/api/users', usersRouter);


app.listen(3000, function() {
 console.log("Server is running at 3000 port!");
});

