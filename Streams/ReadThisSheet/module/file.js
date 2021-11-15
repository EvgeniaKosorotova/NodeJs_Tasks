const fs = require('fs');

module.exports.readFile = (name) => {
  let counter = 1;
  let readStream = fs.createReadStream(`./${name}`, {autoClose : true});

  readStream.on('data', (chunk) => {
    let message = chunk.toString().substr(0, 15);
    console.log(`Chunk ${counter++}:`, message);
  })
    .on('error', (err) => {
      console.log(err);
    });
}