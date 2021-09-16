const express = require('express');
const cors = require('cors')
const app = express();
const mysql = require('mysql');
const port = process.env.PORT || 8080
const fs = require('fs')
var aux;
let comprobarIntent=true;
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

const CreateLine = fs.createWriteStream('../../../../data/nlu.yml', {
  flags: 'a' //flags: 'a' guarda la información antigua del archivo
})
var intent
// app.get('/respuesta', (req, res) => {
//   var intent = req.body
//   res.send(intent)
//   fs.readFile('../../../../data/nlu.yml', function(err, data){
//     if(err)
//         return console.log(err)
//     const arr = data.toString().replace(/\r\n/g, '\n').split('\n')
//       for(let i of arr){
//           console.log(i)
//       }
//     CreateLine.write("\n" + "  - intent: " + intent + '\r\n')
//     CreateLine.write("     examples: | " + '\r\n')
//   })
// })
const PATH_NLU = '../../../../data/nlu.yml'
const PATH_DOMAIN = '../../../../domain.yml'
const PATH_STORIES = '../../../../data/stories.yml'
var query = ""
app.post('/intent', (req, res) => {
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

    fs.readFile(PATH_NLU, function(err, data){
      if(err)
          return console.log(err)
      const arrNLU = data.toString().replace(/\r\n/g, '\n').split('\n')
      aux="  - intent: " + intent;
        for(let i of arrNLU){
            if(i==aux){
             comprobarIntent=false;
             break;
            }
          }
        if(comprobarIntent){
          CreateLine.write("\n" + "  - intent: " + intent + '\r\n')
          CreateLine.write("     examples: | " + '\r\n')
        }else{
          comprobarIntent = true;
        }    
    })
// ########################### DOMAIN
    comprobarIntent = true
    fs.readFile(PATH_DOMAIN, function(err, data){
      if (err) 
        return console.log(err)
      const arrDOMAIN = data.toString().replace(/\r\n/g, '\n').split('\n')
      aux_domain = "intents:"
      let escribirEn = 4
      for(let i of arrDOMAIN){
        // if (i == "actions:")
        //  break; 
        if (i == "  - "+ intent) {
          comprobarIntent=false;
          break;
        }
      }
      if (comprobarIntent){
        arrDOMAIN.splice(escribirEn, 0, "  - " + intent);
        let writer = fs.createWriteStream(PATH_DOMAIN)
        for(let i of arrDOMAIN){
            writer.write(i + '\n')
        }
      }
      else
        comprobarIntent = true;
    })

    comprobarIntent = true
    fs.readFile(PATH_STORIES, function(err, data){
      if (err) 
        return console.log(err)
      aux = "- story: "+intent;
      const arrSTORIES = data.toString().replace(/\r\n/g, '\n').split('\n')
      for(let i of arrSTORIES){
        if (i == aux) {
          comprobarIntent = false;
          break;
        }
      }

      if (comprobarIntent) {
        arrSTORIES.splice(3,0, "  - story: "+ intent)
        arrSTORIES.splice(4,0, "    steps:")
        arrSTORIES.splice(5,0, "      - intent: "+intent)
        arrSTORIES.splice(6,0, "      - action: utter_"+intent+"\n")
        let writer = fs.createWriteStream(PATH_STORIES)
        for(let i of arrSTORIES){
            writer.write(i + '\n')
        }
        // CreateLine.write("\n" + "- story: " + intent + '\r\n')
        // CreateLine.write("  steps:" + '\r\n')
        // CreateLine.write("  - intent: "+intent+"\r\n")
        // CreateLine.write("  - action: utter_"+intent+"\r\n")
      }

    })
  });
})

app.post('/nuevo-intent',(req,res)=>{
  var message = req.body.message
  aux="responses:";
  fs.readFile(PATH_DOMAIN, function(err, data){
    if(err)
        return console.log(err)
    const arr = data.toString().replace(/\r\n/g, '\n').split('\n')
    let escribirEn = arr.indexOf(aux) + 1
      for(let i of arr){
        if (i == '  utter_'+intent+':') {
          comprobarIntent = false;
          break;
          }
        }          
      if (comprobarIntent) {
        arr.splice(escribirEn,0,"  utter_"+intent+":");
        escribirEn+=1
        arr.splice(escribirEn,0,'    - text: "'+message+'"\n');
        let writer = fs.createWriteStream(PATH_DOMAIN)
        for(let i of arr){
            writer.write(i + '\n')
        }
      }else
        comprobarIntent = false
        //CreateLine.write("      - "+message+"\n") 
  })
});


app.listen(port)
console.log('API escuchando en el puerto ' + port)


// const createLine = fs.createWriteStream('text.txt', {
//     flags: 'a'
// })
// fs.readFile('text.txt', function(err, data){
//     if(err)
//         return console.log(err);
//     const arr = data.toString().replace(/\r\n/g, '\n').split('\n');
//     console.log(arr)
//     let escribirEn = arr.indexOf(aux) + 2
//     for(let i of arr){
//         if (i == aux) {
//             arr.splice(escribirEn,0,"nasdasdsd");
//         }
//     }
//     let writer = fs.createWriteStream('text.txt')
//     for(let i of arr){
//         writer.write(i + '\n')
//     }
// });