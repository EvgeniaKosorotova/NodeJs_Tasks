const https = require('https');

module.exports.getCurrencies = () => {
  let options = {
    host: 'www.nbrb.by',
    path: '/api/exrates/currencies',
    method: 'GET'
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      var bodyChunks = [];
      res.on('data', (chunk) => {
        bodyChunks.push(chunk);
      });
      res.on('error', reject);
      res.on('end', () => {
        let body = Buffer.concat(bodyChunks);
        let currencies = JSON.parse(body);

        if (res.statusCode == 200) {
          resolve(currencies);
        } else {
          reject('Request failed. status: ' + res.statusCode + ', body: ' + body);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}