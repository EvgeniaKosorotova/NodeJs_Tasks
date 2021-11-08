const fs = require('fs');
const { Transform } = require('stream');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('File name: ', name =>
{
    let readStream = fs.createReadStream(`./${name}`);
    let writestream = fs.createWriteStream(`Output_${name}`);
    let transformStream = new Transform({
        transform: (data, encoding, callback) => {
            data = data.toString().replace(/р/g, "").replace(/Р/g, "");
            callback(null, data);
        }
    });

    readStream.pipe(transformStream).pipe(writestream);

    readline.close();
});
