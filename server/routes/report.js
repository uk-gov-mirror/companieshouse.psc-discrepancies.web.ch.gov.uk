const router = require('express').Router();
const routeViews = 'report';

const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();

const PscDiscrepancyService = require(`${serverRoot}/services/psc_discrepancy`);
const pscDiscrepancyService = new PscDiscrepancyService();

const Session = require(`${serverRoot}/lib/Session`);
var session; // eslint-disable-line no-unused-vars

const routeUtils = require(`${serverRoot}/routes/utils`);

router.use((req, res, next) => {
  session = new Session(req, res);
  next();
});

router.get('(/report-a-discrepancy)?', (req, res, next) => {
  res.render(`${routeViews}/index.njk`);
});

router.get('/report-a-discrepancy/obliged-entity/contact-name', (req, res, next) => {
  res.render(`${routeViews}/contact_name.njk`);
});

router.post('/report-a-discrepancy/obliged-entity/contact-name', (req, res) => {
  validator.isValidContactName(req.body.fullName)
    .then(_ => {
      res.redirect(302, '/report-a-discrepancy/obliged-entity/email');
    }).catch(err => {
     res.render(`${routeViews}/contact_name.njk`, {
       this_errors: err,
       this_data: req.body
     });
    });
});

router.get('/report-a-discrepancy/obliged-entity/email', (req, res, next) => {
  res.render(`${routeViews}/oe_email.njk`);
});

router.post('/report-a-discrepancy/obliged-entity/email', (req, res, next) => {
  validator.isValidEmail(req.body.email)
    .then(r => {
      return pscDiscrepancyService.saveEmail(req.body.email);
    }).then(r => {
      const o = res.locals.session;
      o.appData.initialServerResponse = r;
      res.locals.session = o;
      return session.write(o);
    }).then(_ => {
      return res.redirect(302, '/report-a-discrepancy/company-number');
    }).catch(err => {
      res.render(`${routeViews}/oe_email.njk`, {
        this_errors: routeUtils.processException(err),
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
      const selfLink = res.locals.session.appData.initialServerResponse.links.self;
      const data = { payload: req.body, selfLink: selfLink };
      return pscDiscrepancyService.saveDiscrepancyDetails(data);
    }).then(_ => {
      res.redirect(302, '/report-a-discrepancy/confirmation');
    }).catch(err => {
      res.render(`${routeViews}/discrepancy_details.njk`, {
        this_errors: routeUtils.processException(err),
        this_data: req.body
      });
    });
});

router.get('/report-a-discrepancy/confirmation', (req, res) => {
  res.render(`${routeViews}/confirmation.njk`);
});

module.exports = router;
