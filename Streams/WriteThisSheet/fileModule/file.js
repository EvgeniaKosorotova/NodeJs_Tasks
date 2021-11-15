const fs = require("fs");

module.exports.checkExistsDir = (path) => {
  fs.mkdir(path, { recursive: true }, (err) => {
    err !== null && console.error(err);
  });
}

module.exports.writeFile = (fileName, data) => {
  fs.writeFile(fileName, data, (err) => {
    if (err)
      throw err;
  });
}