const fs = require("fs");
const { getCurrencies } = require('../bankModule/currencies');
const { getRates } = require('../bankModule/rates');

module.exports.writeAllRates = async () => {
  let today = new Date();
  let endDate = today.toISOString().split('T')[0];
  let startDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];

  let stream = fs.createWriteStream(`BLR-all_${startDate}-${endDate}.txt`, { flags: 'a' });

  let currencies = await getCurrencies();
  let allRates = [];

  for (let currency of currencies) {
    let rates = await getRates(currency.Cur_ID, startDate, endDate);

    if (rates.length > 0) {
      allRates = allRates.concat(rates);
    }
  }

  stream.write(JSON.stringify(allRates));
}