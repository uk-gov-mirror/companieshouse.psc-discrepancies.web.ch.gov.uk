const express = require('express');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const morgan = require('morgan');
global.serverRoot = __dirname;

const Session = require(`${serverRoot}/lib/Session`);
const Utility = require(`${serverRoot}/lib/Utility`);

// log requests
app.use(morgan('combined'));

// views path + engine set-up
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, '/../node_modules/govuk-frontend')
]);

// set nunjucks options
const nunjucksLoaderOpts = {
  watch: process.env.NUNJUCKS_LOADER_WATCH !== 'false',
  noCache: process.env.NUNJUCKS_LOADER_NO_CACHE !== 'true'
};
const njk = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(app.get('views'),
    nunjucksLoaderOpts)
);
njk.express(app);
app.set('view engine', 'njk');

// serve static files
app.use(express.static(path.join(__dirname, '/../app/public')));
// app.use('/assets', express.static(__dirname + '/../node_modules/govuk-frontend/govuk/assets'));

// parse body into req.body
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// unhandled errors
app.use((err, req, res, next) => {
  Utility.logException(err);
});

njk.addGlobal('cdnUrlCss', process.env.CDN_URL_CSS);
njk.addGlobal('cdnUrlJs', process.env.CDN_URL_JS);
njk.addGlobal('cdnHost', process.env.CDN_HOST);
njk.addGlobal('piwikUrl', process.env.PIWIK_URL);
njk.addGlobal('piwikSiteId', process.env.PIWIK_SITE_ID);

// load the session data into res.locals
app.use((req, res, next) => {
  const session = new Session(req, res);
  session.read()
    .then(data => {
      res.locals.session = data;
      next();
    }).catch(err => {
      Utility.logException(err);
      next();
    });
});

// channel all requests through the router
require('./router')(app);

// unhandled exceptions - ideally, should never get to this point
process.on('uncaughtException', err => {
  Utility.logException(err, 'uncaughtException');
  process.exit(1);
});

// unhandled promise rejections
process.on('unhandledRejection', err => {
  Utility.logException(err, 'uncaughtRejection');
  process.exit(1);
});

module.exports = app;
