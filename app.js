var express = require('express');
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

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

var app = express();
const errorHandler = require('./middlewares/errorHandler');

// use Swagger UI middleware
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.get('/', function(req, res) {
 res.send('Hello Express');
});

const usersRouter = require('./routes/users');
// const accountsRouter = require('./routes/accounts');
// const moviesRouter = require('./routes/movies');
// const accessRouter = require('./routes/access');

app.use('/api/users', usersRouter);
// app.use('/api/accounts', accountsRouter);
// app.use('/api/movies', moviesRouter);
// app.use('/api/access', accessRouter);

// Error handling middleware (must be added after all other middleware and route handlers)
// app.use(errorHandler);


app.listen(3000, function() {
 console.log("Server is running at 3000 port!");
});

