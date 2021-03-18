/**
 * General helper methods for the routes
 */

const Utility = require(`${serverRoot}/lib/Utility`);
const logger = require(`${serverRoot}/config/winston`);

const routeUtils = {
  processException: (err, viewData, res) => {
    Utility.logException(err);
    const e = {};
    if (typeof err.code !== 'undefined' && err.code === 'VALIDATION_ERRORS') {
      viewData.this_errors = err.stack;
      res.render(viewData.path, viewData);
    } else {
      res.render('_partials/error.njk');
    }
  },
  setDiscrepancyTypes: (res) => {
    try {
      const kind = res.locals.session.appData.selectedPscDetails.kind;
      logger.info('Setting Discrepancy Types for kind: ', kind);
      if (kind === 'individual-person-with-significant-control') {
        return ['Name', 'Date of birth', 'Nationality',
          'Place of residence', 'Correspondence address', 'Notified date',
          'Nature of control', 'Other reason'];
      } else if (kind === 'legal-person-person-with-significant-control') {
        return ['Name', 'Governing law', 'Legal form',
          'Correspondence address', 'Notified date', 'Nature of control',
          'Other reason'];
      } else if (kind === 'corporate-entity-person-with-significant-control') {
        return ['Company Name', 'Company Number',
          'Place of Registration', 'Incorporation law', 'Governing law',
          'Legal form', 'Correspondence address', 'Notified date',
          'Nature of control', 'Other reason'];
      } else {
        return ['Other reason'];
      }
    } catch (err) {
      return null;
    }
  },
  setPageTitle: (pageName) => {
    return pageName + ' - Report a discrepancy about a beneficial owner on the PSC register - GOV.UK';
  }
};

module.exports = routeUtils;
