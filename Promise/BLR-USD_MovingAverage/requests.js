var https = require('https');

module.exports.getRates = getRates;

function getRates(curId, startDate, endDate) {
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

        if (array.length > 0) {
          array.forEach(currency => {
            curData.curDate = new Date(currency.Date);
            curData.counter += 1;
            curData.rate += currency.Cur_OfficialRate;
          });
  
          curArray.push({
            date: `${curData.curDate.getFullYear()}-${curData.curDate.getMonth()+1}`,
            course: curId,
            movingAverageCourse: (curData.rate / curData.counter).toFixed(4),
          });
        }

        resolve(curArray);
      });
    });
  req.on('error', reject);
  req.end();
});
}