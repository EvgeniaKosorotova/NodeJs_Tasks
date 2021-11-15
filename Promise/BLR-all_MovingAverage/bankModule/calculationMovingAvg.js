module.exports.getMovingAvg = (rates) => {
  let rateSum = 0;
  let movingAvg = [];

  rates.forEach(rate => {
    rateSum += rate.Cur_OfficialRate;
  });

  movingAvg.push({
    date: rates[rates.length - 1].Date.split('T')[0],
    course: rates[0].Cur_ID,
    movingAverageCourse: (rateSum / rates.length).toFixed(4),
  });

  return movingAvg;
}

module.exports.getMovingAvgByMonth = (rates) => {
  let allMovingAvg = [];
  let prevDate = new Date(rates[0].Date);
  let rateByMonth = [];

  rates.forEach(rate => {
    let nextDate = new Date(rate.Date);

    if (nextDate.getMonth() !== prevDate.getMonth()) {
      let movingAvg = this.getMovingAvg(rateByMonth);
      allMovingAvg = allMovingAvg.concat(movingAvg);
      rateByMonth = [];
    }

    rateByMonth.push(rate);
    prevDate = new Date(rate.Date);
  });

  return allMovingAvg;
}