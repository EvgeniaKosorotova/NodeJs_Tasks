const fs = require('fs');
const zlib = require('zlib');
const gzip = zlib.createGzip();

module.exports.moveFiles = () => {
  let pathInput = './input';
  let pathOutput = './output';

  this.checkExistsDir(pathInput);
  this.checkExistsDir(pathOutput);

  fs.readdir(pathInput, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach(file => {
        this.zipFile(file, pathInput, pathOutput);
      });
    }
  });
}

module.exports.zipFile = (file, pathInput, pathOutput) => {
  fs.createReadStream(`${pathInput}/${file}`)
    .pipe(gzip)
    .pipe(fs.createWriteStream(`${pathOutput}/${file}.zip`));
}

module.exports.checkExistsDir = (path) => {
  fs.mkdir(path, { recursive: true }, (err) => {
    err !== null && console.error(err);
  });
}