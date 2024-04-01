const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'maria',
  password : 'maria',
  database : 'videosdb'
});

connection.connect();