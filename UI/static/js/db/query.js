const express = require('express');
var app = express();

var port = process.env.PORT || 8080

app.get('/', function(req, res) {
    res.json({ mensaje: 'Funcionando' })   
  })


app.listen(port)
console.log('API escuchando en el puerto ' + port)