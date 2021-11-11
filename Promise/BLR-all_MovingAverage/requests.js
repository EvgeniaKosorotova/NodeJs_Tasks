var https = require('https');

module.exports.getRates = getRates;
module.exports.getCurrencies = getCurrencies;

function getRates(curId) {
  var today = new Date();
  var endDate = today.toISOString().split('T')[0];
  var startDate = new Date(today.setFullYear(today.getFullYear() - 1)).toISOString().split('T')[0];
  var cleanData = {
    counter: 0,
    rate: 0,
    curDate: new Date(1999, 1, 1)
  };
  let options = {
    host: 'www.nbrb.by',
    path: `/API/ExRates/Rates/Dynamics/${curId}?startDate=${startDate}&endDate=${endDate}`
  };

  return new Promise((resolve, reject) => {
    const req = https.get(options, function (res) {
      var bodyChunks = [];

      res.on('data', (chunk) => {
        bodyChunks.push(chunk);
      }).on('end', () => {
        let body = Buffer.concat(bodyChunks);
        let array = JSON.parse(body);

        var curData = cleanData;
        let curArray = [];

        array.forEach(currency => {
          let newDate = new Date(currency.Date);

          if (curData.curDate.getFullYear() !== 1999 && curData.curDate.getMonth() !== newDate.getMonth()) {
            curArray.push({
              date: `${curData.curDate.getFullYear()}-${curData.curDate.getMonth() + 1}`,
              course: currency.Cur_ID,
              movingAverageCourse: (curData.rate / curData.counter).toFixed(4),
            });

            curData = cleanData;
          }

          curData.curDate = newDate;
          curData.counter += 1;
          curData.rate += currency.Cur_OfficialRate;
        });

        resolve(curArray);
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function getCurrencies() {
  var optionsGetCurrencies = {
    host: 'www.nbrb.by',
    path: '/api/exrates/currencies'
  };

  return new Promise((resolve, reject) => {
    const req = https.get(optionsGetCurrencies, (res) => {
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