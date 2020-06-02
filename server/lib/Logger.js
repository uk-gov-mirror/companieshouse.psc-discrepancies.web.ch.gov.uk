const chl = require('ch-logging');
let logger; // eslint-disable-line no-unused-vars

function loggerInstance() {
  if (!logger) {
    logger = chl.createLogger('psc-discrepancies-web');
  }
  return logger;
};

exports.loggerInstance = loggerInstance;
