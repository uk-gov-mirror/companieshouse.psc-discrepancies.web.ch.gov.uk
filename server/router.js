
// Do route dispatch here

module.exports = function (app) {
  app.use('/', require('./routes/report'));
}
