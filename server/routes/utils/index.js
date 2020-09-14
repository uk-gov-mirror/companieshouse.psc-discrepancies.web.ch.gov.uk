/**
 * General helper methods for the routes
 */

const Utility = require(`${serverRoot}/lib/Utility`);

const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).generic;

const routeUtils = {
  processException: (err, res) => {
    Utility.logException(err);
    let e = {};
    if (typeof err.code !== 'undefined' && err.code === 'VALIDATION_ERRORS') {
      e = err.stack;
    } else {
      return res.render('_partials/error.njk');
      //e.genericError = errorManifest.serverError;
    }
    return e;
  }
}

module.exports = routeUtils;
