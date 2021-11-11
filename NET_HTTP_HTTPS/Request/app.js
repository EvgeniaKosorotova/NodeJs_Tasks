const url = require('url');
const req = require('./httpPromise');

var optionsGetCurrencies = {
  host: 'www.nbrb.by',
  path: '/api/exrates/currencies/1',
  method: 'GET'
};

req.get(optionsGetCurrencies)
  .then((res) => { console.log(res) })
  .catch((err) => { console.error(err) });

/*
req.post(optionsGetCurrencies)
  .then((res) => { console.log(res)})
  .catch((err)=>{console.error(err)});
  */