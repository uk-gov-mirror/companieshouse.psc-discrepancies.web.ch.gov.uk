const winston = require('winston');
const { format } = winston;
const { combine } = format;
const colorizer = winston.format.colorize();

// Print options for the console depending on environment
const printOpts = transport => {
  let optimiser;
  if (transport === 'console' && (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev')) {
    optimiser = msg =>
      colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`);
  } else {
    optimiser = msg => {
      const { timestamp, level, message, ...args } = msg;
      return `${timestamp.substr(0, 19)} - ${level}: ${message} ${Object.keys(args).length ? '-' + JSON.stringify(args, null, 2) : ''}`;
    };
  }
  return optimiser;
};

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: `${__dirname}/../logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: combine(
      winston.format.timestamp(),
      winston.format.simple(),
      winston.format.printf(printOpts('file'))
    )
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
    format: combine(
      winston.format.timestamp(),
      winston.format.simple(),
      winston.format.printf(printOpts('console'))
    )
  }
};

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};

module.exports = logger;
