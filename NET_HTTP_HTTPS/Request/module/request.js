module.exports.createRequest = (options, resolve = print, reject = print) => {
  return require(options.protocolName).request(options, (res) => {
    let body = '';

    res.on('data', (chunk) => {
      body += chunk.toString();
    })
      .on('error', (e) => {
        reject(e.message);
      })
      .on('end', () => {
        if (res.statusCode < 400) {
          resolve(body);
        } else {
          reject(`Request failed. status: ${res.statusCode}, body: ${body}`);
        }
      });
  })
  .on('error', (e) => {
    reject(e.message);
  });
}

function print(msg) {
  console.log(msg);
}