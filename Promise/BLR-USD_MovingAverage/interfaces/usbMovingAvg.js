const { getCurrencies } = require('../bankModule/currencies');
const { getRates } = require('../bankModule/rates');
const { getMovingAvg } = require('../bankModule/calculationMovingAvg');

module.exports.getUSBMovingAvg = async () => {
  let today = new Date();
  let endDate = today.toISOString().split('T')[0];
  let startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];

  let currencies = await getCurrencies();
  let usb = currencies.find(currency => currency.Cur_Abbreviation === 'USD');
  let rates = usb !== undefined ? await getRates(usb.Cur_ID, startDate, endDate) : [];
  let usbMovingAvg = [];

  if (rates.length > 0) {
    rates = rates.slice(-30);
    usbMovingAvg = getMovingAvg(rates);
  }

  return usbMovingAvg;
}