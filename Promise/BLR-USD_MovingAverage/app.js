const usbMovingAvg = require('./interfaces/usbMovingAvg');

usbMovingAvg.getUSBMovingAvg()
  .then((data) => { console.log(data); })
  .catch((e) => { console.error(e) });