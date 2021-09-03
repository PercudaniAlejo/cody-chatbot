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

// function QueryMessage ()
// {
//     const conn = connectionDB();   
//     conn.query('SELECT * FROM articulos', (err, rows) => {
//         if(err) throw err
//         console.log('Datos de la tabla: ')
//         console.log(rows)
//     });

// var word = "programacion";
    // var query = "SELECT *, MATCH(title, body) AGAINST('"+message+"') as rank FROM articulos WHERE MATCH(title, body) AGAINST('"+message+"') ORDER BY rank DESC"
    // connection.query(query, (err, rows) => {
    //     if(err) throw err
    //     console.log("Búsqueda: " + message)
    //     console.log(rows)
    //     let rankMayor = 0;
    //     let titleMayor = "";
    //     for(var x in rows){
    //         if (rankMayor < rows[x].rank) 
    //             rankMayor = rows[x].rank;
    //             titleMayor = rows[x].title;            
    //     };
    //     console.log("Rango de coincidencia: " + rankMayor)
    //     console.log("Titulo del resultado: " + titleMayor)
    // });
    // connection.end();
// }

module.exports = {
  // "queryDB": QueryMessage,
    "connectionDB": connectionDB
}

