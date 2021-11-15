const { getCurrencies } = require('../bankModule/currencies');
const { getRates } = require('../bankModule/rates');
const { checkExistsDir, writeFile } = require('../fileModule/file');

module.exports.writeAllRates = async () => {
  let today = new Date();
  let endDate = today.toISOString().split('T')[0];
  let startDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];

  let path = './files';
  checkExistsDir(path);

  let currencies = await getCurrencies();

  for (let currency of currencies) {
    let rates = await getRates(currency.Cur_ID, startDate, endDate);

    if (rates.length > 0) {
      let fileName = `${path}/${currency.Cur_Name.replace(' ', '_')}_${startDate}-${endDate}.txt`;
      writeFile(fileName, JSON.stringify(rates));
    }
  }
}