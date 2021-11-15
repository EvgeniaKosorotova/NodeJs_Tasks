const allMovingAvg = require('./interfaces/allMovingAvg');

allMovingAvg.getAllMovingAvg()
  .then((data) => { console.log(data); })
  .catch((e) => { console.error(e) });