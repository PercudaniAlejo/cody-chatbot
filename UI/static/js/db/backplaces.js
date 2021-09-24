const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5050
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

var shops
app.get('/apiansw', (req, res) => {
  res.send(JSON.stringify(shops))
  console.log("HICIERON UN GET")
  console.log(shops) // 
})

app.post('/apiansw', (req, res) => {
  console.log("HICIERON UN POST");
  shops = req.body;
  console.log(shops);
});

let lat = 0;
let lon = 0;
let body = 0;
let arr = []
app.get('/location', (req, res) => {
  console.log(lat + " " + lon);
  // res.send(lat);
  res.send(JSON.stringify(arr));
})

app.post('/location', (req, res) => {
  body = req.body;
  lat = req.body.latitude
  lon = req.body.longitude
  console.log("lat: " , lat)
  console.log("lon: " , lon)
  arr.push(lat)
  arr.push(lon)
})


app.listen(port)
console.log('API escuchando en el puerto ' + port)
