const https = require('https');

module.exports.getRates = (currId, startDate, endDate) => {
  let options = {
    host: 'www.nbrb.by',
    path: `/API/ExRates/Rates/Dynamics/${currId}?startDate=${startDate}&endDate=${endDate}`,
    method: 'GET'
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, function (res) {
      let bodyChunks = [];

      res.on('data', (chunk) => {
        bodyChunks.push(chunk);
      })
        .on('end', () => {
          let body = Buffer.concat(bodyChunks);
          let array = JSON.parse(body);

          resolve(array);
        });
    });
    req.on('error', reject);
    req.end();
  });
}