const express = require('express');
const cors = require('cors')
const app = express();
const mysql = require('mysql');
const port = process.env.PORT || 8080;
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
const connectionDB = require("./db");
const { config } = require('dotenv');
const conn = connectionDB.connectionDB(); 
if (conn) 
console.log("Conectado")
//#endregion

const PATH_NLU = './data/nlu.yml'
const PATH_DOMAIN = './domain.yml'
const PATH_STORIES = './data/stories.yml'
const CreateLine = fs.createWriteStream(PATH_NLU, {
  flags: 'a' //flags: 'a' guarda la información antigua del archivo
})
let intent

let query = ""
app.post('/intent', (req, res) => {
  res.send(JSON.stringify("Guardado"))
  console.log(req.body)
  var message = req.body.message
  query = "SELECT *, MATCH(title, body) AGAINST('"+message+"') as rank FROM articulos WHERE MATCH(title, body) AGAINST('"+message+"') ORDER BY rank DESC"
  conn.query(query, (err, rows) => {
    if(err) throw err
    console.log("Búsqueda: " + message)
    let rankMayor = 0;
    let titleMayor = "";
    let bodyMayor = "";
    for(var x in rows){
      if (rankMayor < rows[x].rank) 
        rankMayor = rows[x].rank;
        titleMayor = rows[x].title;    
        bodyMayor=rows[x].body;        
      };
    console.log("Rango de coincidencia: " + rankMayor)
    console.log("Titulo del resultado: " + titleMayor)
    bodyMayor = bodyMayor.toLowerCase();
    let arrBody= bodyMayor.split(' ')
    intent = titleMayor
    if(intent!=""){
    let arrPeso = [];
    /*Vector con basura*/let arrBasura=['lo', 'del', 'una', 'de','para','el','la','con','sí','si','sin','que','qué','como','cuando','donde','este','y','ya','durante','sobre','según','igual','por','o','u','se','tambien','más','los','además','aparte','asimismo','tanto','han','tampoco','es','al','fueron','fue','no','su','en','a','un','las','sus','ha','entre'];
    let cont=0;
    let sino = true
    let txt = []
  for(var x in arrBody){///eliminar basura
    for (var y in arrBasura){
      if(arrBody[x] == arrBasura[y]){
        sino = false;
        break;
      }
    }
    if(sino)
       txt.push(arrBody[x])
    sino = true
  }
  console.log(txt)
  for(var x in txt){///calcular peso de cada palabra
    for(var y in txt){
      if(txt[x]==txt[y]){
        cont++
      }
    }
    arrPeso.push(cont)
  cont = 0;
  }

  let dicPalabras = {}
  for(var x in txt){
      if (!dicPalabras[txt[x]]) {
        dicPalabras[txt[x]] = 1        
      }else{
        dicPalabras[txt[x]] += 1
    }
  }

// Create items array
  var itemsTop5 = Object.keys(dicPalabras).map(function(key) {
    return [key,dicPalabras[key]]
  });
// Ordenar por cantidad de palabras
itemsTop5.sort(function(first, second) {
  return second[1] - first[1];
});

console.log(itemsTop5)
itemsTop5 = itemsTop5.slice(0, 5)
let arrSinonimos = []
Object.values(itemsTop5).forEach(([key, value]) => {
  arrSinonimos.push(key)
})

console.log(arrSinonimos)
//-----------------------------------------------------------------------------------
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
          for(let x in arrSinonimos)
          {
            CreateLine.write("      - " + arrSinonimos[x] + "\r\n")
          }
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
      aux = "  - story: "+intent;
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
      }

    })
  }
  });
})

app.post('/primer-respuesta',(req,res)=>{
  var message = req.body.message
  aux="responses:";
  if(intent!=""){
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
}
});

let intent2
app.post('/buscar-intent', (req, res) => {
  res.send(JSON.stringify("Guardado"));
  let messageBuscarIntent = req.body.message;
  console.log(messageBuscarIntent);
  messageBuscarIntent= "      - "+messageBuscarIntent
  intent2 = ""
  fs.readFile(PATH_NLU, function(err, data){
    if(err)
        return console.log(err)
    const arrNLU = data.toString().replace(/\r\n/g, '\n').split('\n')
    aux = "    examples: |";
    let cont=0;
    let aux2;
    let buscarIntent = true
    for(let i of arrNLU)
    {
      if(i == aux){
        aux2 = cont;
      }
      if (i.toLowerCase() == messageBuscarIntent.toLowerCase()){
        buscarIntent = true
        break;
      }else{
        buscarIntent = false
      }
      cont++;
    }
    if(buscarIntent){
      aux2--;
      console.log("Pos intent: ",aux2)
      console.log("Intent: ",arrNLU[aux2])
      let arrIntentconcat = arrNLU[aux2].split(" ")
      intent2 = arrIntentconcat[arrIntentconcat.length-1]
    } 
    });
    console.log(intent2)
  if(intent2 == ""){
  var message = req.body.message
  query = "SELECT *, MATCH(title, body) AGAINST('"+message+"') as rank FROM articulos WHERE MATCH(title, body) AGAINST('"+message+"') ORDER BY rank DESC"
  conn.query(query, (err, rows) => {
    if(err) throw err
    console.log("Búsqueda: " + message)
    let rankMayor = 0;
    let titleMayor = "";
    let bodyMayor = "";
    for(var x in rows){
      if (rankMayor < rows[x].rank) 
        rankMayor = rows[x].rank;
        titleMayor = rows[x].title;
        bodyMayor=rows[x].body;
      };
    console.log("Rango de coincidencia: " + rankMayor)
    console.log("Titulo del resultado: " + titleMayor)
    if(titleMayor != "")
      intent2 = titleMayor
  })
}
});

app.post('/nuevas-respuestas',(req,res)=>{
  let message = req.body.message;
  aux = "  utter_"+ intent2 +":";
  fs.readFile(PATH_DOMAIN, function(err, data){
    if(err)
        return console.log(err)
    const arrDOMAIN = data.toString().replace(/\r\n/g, '\n').split('\n')
    let escribirEn = arrDOMAIN.indexOf(aux) + 1;
      arrDOMAIN.splice(escribirEn, 0, '    - text: "'+ message +'"');
      let writer = fs.createWriteStream(PATH_DOMAIN);
      for(let i of arrDOMAIN){
          writer.write(i + '\n');
      }
  })
});

const { stdout } = require('process');
const { exec } = require('child_process');
app.post('/iniciar-train', (req,res)=>{
    var exec = require('child_process').exec, child; 
    child = exec('taskkill /IM rasa.exe /F', function (err,stdout){
      exec('start /MIN TASKKILL /IM cmd.exe /F\n', function (err,stdout){
        exec('start /MIN npm run rasa-train', function (err,stdout){
          exec('start /MIN npm run rasa-init', function (err,stdout){})
        })
      })
})
})
app.listen(port)
console.log('API escuchando en el puerto ' + port)