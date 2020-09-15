/**
 * General helper methods for the routes
 */

const Utility = require(`${serverRoot}/lib/Utility`);

const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).generic;

const routeUtils = {
  processException: (err, viewData, res) => {
    Utility.logException(err);
    let e = {};
    if (typeof err.code !== 'undefined' && err.code === 'VALIDATION_ERRORS') {
      viewData.this_errors = err.stack;
      res.render(viewData.path, viewData);
    } else {
      res.render('_partials/error.njk');
    }
  }
}

module.exports = routeUtils;
