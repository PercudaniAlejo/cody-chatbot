const express = require('express');
const cors = require('cors')
const app = express();
const mysql = require('mysql');
const port = process.env.PORT || 5005
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

app.get('/apiansw', (req, res) => {
  console.log("HICIERON UN GET")
})

app.post('/apiansw', (req, res) => {
  console.log("HICIERON UN POST")
  console.log(req.body)
});

app.listen(port)
console.log('API escuchando en el puerto ' + port)