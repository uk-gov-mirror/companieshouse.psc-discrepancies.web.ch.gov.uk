
// Do route dispatch here

module.exports = app => {
  app.use('/', require('./routes/report'));
};
