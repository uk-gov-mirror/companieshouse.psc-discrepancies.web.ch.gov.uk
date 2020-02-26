
// Do route dispatch here

module.exports = function (app) {
    app.use('/', require('./routes/route-1'));
    app.use('/route-1', require('./routes/route-1'));
    app.use('/route-2', require('./routes/route-2'));
    app.use('/route-3', require('./routes/route-3'));
}
