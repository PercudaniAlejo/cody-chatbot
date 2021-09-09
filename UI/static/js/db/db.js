// npm i mysql
// npm i dotenv
const mysql = require('mysql');
require('dotenv').config();

function connectionDB(){
    const connection = mysql.createConnection({
        // host: process.env.DB_HOST,
        // user: process.env.DB_USER,
        // password: process.env.DB_PASSWORD,
        // database: process.env.DB_DATABASE
        host: 'localhost',
        user: 'root',
        database: 'cody_fulltext'
    });
    return connection
}

module.exports = {
    "connectionDB": connectionDB
}

