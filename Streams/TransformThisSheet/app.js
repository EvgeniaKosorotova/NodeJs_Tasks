const { transformFile } = require('./module/file');
const { inputName } = require('./module/input');

setTimeout(inputName, 3000);
transformFile('Karl_Marx-Das_Kapital.txt');