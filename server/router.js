
// Do route dispatch here

module.exports = function (app) {
  app.use('/', require('./routes/report'));
  // app.use('/report-a-discrepancy', require('./routes/discrepancy'));
  // app.use('/report-a-discrepancy/obliged-entity/name', require('./routes/discrepancy'));
  // app.use('/report-a-discrepancy/obliged-entity/email', require('./routes/discrepancy'));
  // app.use('/report-a-discrepancy/psc/company-number', require('./routes/discrepancy'));
  // app.use('/report-a-discrepancy/psc/discrepancies', require('./routes/discrepancy'));
  // app.use('/report-a-discrepancy/confirmation', require('./routes/discrepancy'));

}

/*

- rename to report
- constify long strings
-

*/
