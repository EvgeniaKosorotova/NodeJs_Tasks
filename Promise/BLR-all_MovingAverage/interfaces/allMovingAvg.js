const { getCurrencies } = require('../bankModule/currencies');
const { getRates } = require('../bankModule/rates');
const { getMovingAvgByMonth } = require('../bankModule/calculationMovingAvg');

module.exports.getAllMovingAvg = async () => {
  let today = new Date();
  let endDate = today.toISOString().split('T')[0];
  let startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
  let currencies = await getCurrencies();
  let allMovingAvg = [];

  for (let currency of currencies) {
    let rates = await getRates(currency.Cur_ID, startDate, endDate);

    if (rates.length > 0) {
      let movingAvg = getMovingAvgByMonth(rates);
      allMovingAvg = allMovingAvg.concat(movingAvg);
    }
  }

  return allMovingAvg;
}