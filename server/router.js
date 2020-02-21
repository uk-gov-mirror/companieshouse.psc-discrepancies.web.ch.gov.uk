
// Do controller dispatch here

module.exports = function (app) {
    app.use('/', require('./controllers/ctrlr-1'));
    app.use('/ctrlr-1', require('./controllers/ctrlr-1'));
    app.use('/ctrlr-2', require('./controllers/ctrlr-2'));
    app.use('/ctrlr-3', require('./controllers/ctrlr-3'));
}
