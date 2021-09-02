const fs = require('fs')
const CreateLine = fs.createWriteStream('../../../data/nlu.yml', {
    flags: 'a' //flags: 'a' guarda la información antigua del archivo
})

fs.readFile('../../../data/nlu.yml', function(err, data){
    if(err)
        return console.log(err)
    const arr = data.toString().replace(/\r\n/g, '\n').split('\n')
    for(let i of arr){
        console.log(i)
    }
    CreateLine.write("asd" + '\r\n')
})