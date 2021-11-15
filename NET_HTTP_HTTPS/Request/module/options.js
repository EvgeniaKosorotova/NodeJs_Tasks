const { URL } = require('url');

module.exports.getOptions = (url) => {
  try {
    let splitUrl = new URL(url);

    return {
      hostname: splitUrl.hostname,
      port: splitUrl.port,
      path: splitUrl.pathname,
      protocolName: splitUrl.protocol.replace(':', '')
    };
  } catch (error) {
    console.error(error);
  }
}