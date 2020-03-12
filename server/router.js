
// Do route dispatch here

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });
  app.use('/', require('./routes/report'));
}
