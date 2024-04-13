const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'maria',
    password: 'maria',
});

con.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL!');
    con.query('CREATE DATABASE videosdb', (err, result) => {
        if (err) throw err;
        console.log('Database created');
    });
});