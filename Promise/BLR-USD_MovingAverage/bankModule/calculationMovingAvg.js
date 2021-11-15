module.exports.getMovingAvg = (rates) => {
  let rateSum = 0;
  let movingAvg = [];

  rates.forEach(rate => {
    rateSum += rate.Cur_OfficialRate;
  });

  movingAvg.push({
    date: rates[rates.length-1].Date.split('T')[0],
    course: rates[0].Cur_ID,
    movingAverageCourse: (rateSum / rates.length).toFixed(4),
  });

  return movingAvg;
}