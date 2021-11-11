const requests = require('./requests');

(async () => {
  var output = [];

  var promiseCur = requests.getCurrencies();
  var currencies = await promiseCur;

  for (let currency of currencies) {
    var promiseRate = requests.getRates(currency.Cur_ID);
    var rates = await promiseRate;
    if (rates.length !== 0) {
      output = output.concat(rates);
    }
  }

  console.log(output);
})()