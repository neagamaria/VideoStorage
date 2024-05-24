var express = require('express');
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var swaggerUi = require("swagger-ui-express");
var swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "VideoStorage",
            version: "1.0.0",
        },
    },
    apis: ["./routes/*.js", "./swagger/schemas.yaml"],
};

const openapiSpecification = swaggerJsdoc(options);
const errorHandler = require('./middlewares/errorHandler');

var app = express();

// middleware for JSON parsing
app.use(express.json());

// middleware for cookie parsing and logging if necessary
app.use(cookieParser());
app.use(logger('dev'));

// swagger UI middleware
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.get('/', function(req, res) {
    res.send('Hello Express');
});

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const body = require('express-validator');
const accountsRouter = require('./routes/accounts');
const moviesRouter = require('./routes/movies');
const movieImagesRouter = require('./routes/movieImages');
const categoriesRouter = require('./routes/categories');
const accessesRouter = require('./routes/accesses');

app.use('/api/users', usersRouter);
app.use('/api/auth' , authRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/movieImages', movieImagesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/accesses', accessesRouter);

app.use(errorHandler);

app.listen(3000, function() {
    console.log("Server is running at 3000 port!");
});
