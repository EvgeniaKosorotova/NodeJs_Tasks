const { readFile } = require('./file');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports.inputName = () => {
  readline.question('File name: ', name => {
    readFile(name);
    readline.close();
  });
}