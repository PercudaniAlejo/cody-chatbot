const express = require('express');
const cors = require('cors')
const app = express();
const mysql = require('mysql');
const port = process.env.PORT || 5005
const fs = require('fs');
const { json } = require('express');
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
  console.log("HICIERON UN POST")
  shops = req.body
  console.log(shops)
});

app.get('/location', (req, res) => {
})

app.post('/location', (req, res) => {
  lat = req.body.latitude
  lon = req.body.longitude
  console.log("lat: " , lat)
  console.log("lon: " , lon)
})


app.listen(port)
console.log('API escuchando en el puerto ' + port)