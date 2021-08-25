// npm i mysql
// npm i dotenv
const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect( (err) => {
    if(err) throw err
    console.log('La conexión fue establecida')
});

connection.query('SELECT * FROM articulos', (err, rows) => {
    if(err) throw err
    console.log('Datos de la tabla: ')
    console.log(rows)
    console.log('Cantidad de usuarios: ' + rows.length)
});

var word = "programas";
var query = "SELECT *, MATCH(title, body) AGAINST('"+word+"') as rank FROM articulos WHERE MATCH(title, body) AGAINST('"+word+"') ORDER BY rank DESC"
connection.query(query, (err, rows) => {
    if(err) throw err
    console.log('Datos de la tabla: ')
    console.log(rows)
});

connection.end();