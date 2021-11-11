const https = require('https');

module.exports.get = request;
// module.exports.post = request;

function request(urlOptions, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(urlOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk.toString();
      });
      res.on('error', reject);
      res.on('end', () => {
        if (res.statusCode == 200) {
          resolve({ statusCode: res.statusCode, headers: res.headers, body: body });
        }
        else {
          reject('Request failed. status: ' + res.statusCode + ', body: ' + body);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}