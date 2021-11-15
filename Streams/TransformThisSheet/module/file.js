const fs = require('fs');
const { Transform } = require('stream');

module.exports.transformFile = (name) => {
  let transformStream = new Transform({
    transform: (data, encoding, callback) => {
      data = data.toString().replace(/р/g, "").replace(/Р/g, "");
      callback(null, data);
    }
  });

  fs.createReadStream(`./${name}`)
    .pipe(transformStream)
    .on('data', (data) => {
      fs.createWriteStream(`./${name}`)
        .write(data);
    });
}