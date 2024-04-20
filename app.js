var express = require('express');
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var swaggerUi = require("swagger-ui-express");
//@ts-ignore
var swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "VideoStorage",
            version: "1.0.0",
        },
    },
    apis: ["./routes/*.js", "./swagger/schemas.yaml"], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
const errorHandler = require('./middlewares/errorHandler');

var app = express();

// Middleware for JSON parsing
app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // If you need to parse URL-encoded bodies

// Middleware for cookie parsing and logging if necessary
app.use(cookieParser());
app.use(logger('dev'));

// Swagger UI middleware
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.get('/', function(req, res) {
    res.send('Hello Express');
});

const usersRouter = require('./routes/users');
const body = require('express-validator');
// const accountsRouter = require('./routes/accounts');
// const moviesRouter = require('./routes/movies');
// const accessRouter = require('./routes/access');

app.use('/api/users', usersRouter);
// app.use('/api/accounts', accountsRouter);
// app.use('/api/movies', moviesRouter);
// app.use('/api/access', accessRouter);

app.use(errorHandler);

app.listen(3000, function() {
    console.log("Server is running at 3000 port!");
});
