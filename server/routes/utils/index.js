/**
 * General helper methods for the routes
 */

const Utility = require(`${serverRoot}/lib/Utility`);

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
  },
  setDiscrepancyTypes: (kind) => {
    if (kind ===
        'individual-person-with-significant-control') {
      return ['name', 'Date of birth', 'Nationality',
        'Place of residence', 'Correspondence address', 'Notified date',
        'Nature of control', 'Other reason'];
    }
    if (kind ===
        'legal-person-person-with-significant-control') {
      return ['name', 'Governing law', 'Legal form',
        'Correspondence address', 'Notified date', 'Nature of control',
        'Other reason'];
    }
    if (kind ===
        'corporate-entity-person-with-significant-control') {
      return ['Company Name', 'Company Number',
        'Place of Registration', 'Incorporation law', 'Governing law',
        'Legal form', 'Correspondence address', 'Notified date',
        'Nature of control', 'Other reason'];
    }
  }
};

module.exports = routeUtils;
