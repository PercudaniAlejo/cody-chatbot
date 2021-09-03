const express = require('express');
const cors = require('cors')
const app = express();
const mysql = require('mysql');
const port = process.env.PORT || 8080
const fs = require('fs')
//#region
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json({
  type: "*/*"
}))

app.use(cors());
//#endregion

//#region DB connection
const connectionDB = require("./db")
const conn = connectionDB.connectionDB();
if (conn) 
  console.log("Conectado")
//#endregion

let intent = ""
const CreateLine = fs.createWriteStream('../../../../data/nlu.yml', {
  flags: 'a' //flags: 'a' guarda la información antigua del archivo
})

app.get('/respuesta', (req, res) => {
  res.send(intent)
  fs.readFile('../../../../data/nlu.yml', function(err, data){
    if(err)
        return console.log(err)
    const arr = data.toString().replace(/\r\n/g, '\n').split('\n')
    for(let i of arr){
        console.log(i)
    }
    CreateLine.write("\n" + "  - intent: " + intent + '\r\n')
    CreateLine.write("     examples: | " + '\r\n')
  })
})


var query = ""
app.post('/respuesta', (req, res) => {
  res.send(JSON.stringify("Guardado"))
  console.log(req.body)
  // res.send(JSON.stringify(req.body))
  var message = req.body.message
  // message = "programacion"
  query = "SELECT *, MATCH(title, body) AGAINST('"+message+"') as rank FROM articulos WHERE MATCH(title, body) AGAINST('"+message+"') ORDER BY rank DESC"
  conn.query(query, (err, rows) => {
    if(err) throw err
    console.log("Búsqueda: " + message)
    let rankMayor = 0;
    let titleMayor = "";
    for(var x in rows){
      if (rankMayor < rows[x].rank) 
        rankMayor = rows[x].rank;
        titleMayor = rows[x].title;            
      };
    console.log("Rango de coincidencia: " + rankMayor)
    console.log("Titulo del resultado: " + titleMayor)
    intent = titleMayor
  });

})

app.listen(port)
console.log('API escuchando en el puerto ' + port)