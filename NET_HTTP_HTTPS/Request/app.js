const Module = require('./module/module');

Module.get('http://httpbin.org/get')
  .then((res) => { console.log(res) })
  .catch((err) => { console.error(err) });

Module.post('http://httpbin.org/post')
  .then((res) => { console.log(res) })
  .catch((err) => { console.error(err) });


Module.get('https://reqres.in/api/users/2')
  .then((res) => { console.log(res) })
  .catch((err) => { console.error(err) });

Module.post('https://reqres.in/api/users', {
  "name": "morpheus",
  "job": "leader"
})
  .then((res) => { console.log(res) })
  .catch((err) => { console.error(err) });