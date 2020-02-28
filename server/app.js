//const exec = require('child_process').exec;
const express  = require('express');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const morgan = require('morgan');
const logger = require('./config/winston');
global.appRoot = __dirname;
const util = require('./routes/utils');

// log requests
app.use(morgan('combined'));

// views path + engine set-up
app.set('views', __dirname + '/views');	app.set('views', [
  __dirname + '/views',
  __dirname + '/../node_modules/govuk-frontend'
]);

const nunjucksLoaderOpts = {
  "watch": process.env.NUNJUCKS_LOADER_WATCH !== 'false',
  "noCache": process.env.NUNJUCKS_LOADER_NO_CACHE !== 'true'
};
const njk = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(app.get('views'),
    nunjucksLoaderOpts)
);
njk.express(app);
app.set('view engine', 'njk');

// serve static files
app.use(express.static(__dirname + '/../app/public'));
// app.use('/assets', express.static('./../node_modules/govuk-frontend/govuk/assets'))

// parse body into req.body
app.use(bodyParser.json()); // for parsing application/json
app.use(cookieParser());

// Channel all requests through the router
require('./router')(app);

// unhandled errors
app.use((err, req, res, next) => {
  let status = err.status || 500;
  logger.error(`${status} - appError: ${err.stack}`);
});

// unhandled exceptions - ideally, should never get to this point
process.on('uncaughtException', err => {
  let status = err.status || 500;
  logger.error(`${status} - uncaughtException: ${err.stack}`);
  process.exit(1);
});

// unhandled promise rejections
process.on('unhandledRejection', err => {
  let status = err.status || 500;
  logger.error(`${status} - unhandledRejection: ${err.stack}`);
  process.exit(1);
});

module.exports = app;
