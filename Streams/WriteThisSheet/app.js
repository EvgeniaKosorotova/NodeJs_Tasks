const writingAllRates = require('./interfaces/writingAllRates');

writingAllRates.writeAllRates()
  .catch((e) => { console.error(e) });