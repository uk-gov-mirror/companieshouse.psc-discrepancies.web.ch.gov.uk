const router = require('express').Router();
const routeViews = 'report';
const Validator = require(`${serverRoot}/lib/validation`);
const PscDiscrepancyService = require(`${serverRoot}/services/psc_discrepancy`);
const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`);

const pscDiscrepancyService = new PscDiscrepancyService();
const validator = new Validator();

router.get('(/report-a-discrepancy)?', (req, res, next) => {
  res.render(`${routeViews}/index.njk`);
});

router.get('/report-a-discrepancy/obliged-entity/email', (req, res, next) => {
  res.render(`${routeViews}/oe_email.njk`);
});

router.post('/report-a-discrepancy/obliged-entity/email', (req, res, next) => {
  validator.isValidEmail(req.body.email)
    .then(r => {
      return pscDiscrepancyService.saveEmail(req.body.email);
    }).then(r => {
      return res.redirect(302, '/report-a-discrepancy/company-number');
    }).catch(err => {
      let e = {};
      if (typeof err.statusCode !== 'undefined') {
        e.genericError = errorManifest.genericError;
      } else {
        e = err;
      }
      res.render(`${routeViews}/oe_email.njk`, {
        this_errors: e,
        this_data: req.body
      });
    });
});

router.get('/report-a-discrepancy/company-number', (req, res) => {
  res.render(`${routeViews}/company_number.njk`);
});

router.post('/report-a-discrepancy/company-number', (req, res) => {
  validator.isCompanyNumberFormatted(req.body.number)
    .then(_ => {
      res.redirect(302, '/report-a-discrepancy/discrepancy-details');
    }).catch(err => {
      res.render(`${routeViews}/company_number.njk`, {
        this_errors: err,
        this_data: req.body
      });
    });
});

router.get('/report-a-discrepancy/discrepancy-details', (req, res) => {
  res.render(`${routeViews}/discrepancy_details.njk`);
});

router.post('/report-a-discrepancy/discrepancy-details', (req, res, next) => {
  validator.isTextareaNotEmpty(req.body.details)
    .then(r => {
      const data = { payload: req.body, report: {} };
      return pscDiscrepancyService.saveDiscrepancyDetails(data);
    }).then(_ => {
      res.redirect(302, '/report-a-discrepancy/confirmation');
    }).catch(err => {
      res.render(`${routeViews}/discrepancy_details.njk`, {
        this_errors: err,
        this_data: req.body
      });
    });
});

router.get('/report-a-discrepancy/confirmation', (req, res) => {
  res.render(`${routeViews}/confirmation.njk`);
});

module.exports = router;
