const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

var data = [];
var counter = 1;
var strLenght = 15;

readline.question('File name: ', name => {
    var readStream = fs.createReadStream(`./${name}`, { highWaterMark: 503872 });

    readStream.on('data', (chunk) => {
        data.push(chunk);
        let message = chunk.toString().substr(0, strLenght);
        console.log(`Chunk ${counter++}:`, message);
    });

    readStream.on('error', (err) => {
        console.log('error :', err);
    })

    readline.close();
});
