const requests = require('./requests');

var usdId = 145;
var today = new Date();
var endDate = today.toISOString().split('T')[0];
var startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];

(async () => {
  var output = [];

  var promiseRate = requests.getRates(usdId, startDate, endDate);
  var rates = await promiseRate;
  if (rates.length !== 0) {
    output = output.concat(rates);
  }

  console.log(output);
})()