const { getOptions } = require('./options');
const { createRequest } = require('./request');

module.exports.get = (url) => {
  let options = getOptions(url);
  options.method = 'GET';

  return new Promise((resolve, reject) => {
    let req = createRequest(options, resolve, reject);
    req.end();
  });
}

module.exports.post = (url, data = null) => {
  data = JSON.stringify(data);

  let options = getOptions(url);
  options.method = 'POST';
  options.headers = {
    'Content-Type': 'application/json',
    'Content-Length': data === null ? 0 : Buffer.byteLength(data)
  };

  return new Promise((resolve, reject) => {
    let req = createRequest(options, resolve, reject);
    data !== null && req.write(data);
    req.end();
  });
}