const router = require('express').Router();
const logger = require(`${serverRoot}/config/winston`);

const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();

const PscDiscrepancyService = require(`${serverRoot}/services/psc_discrepancy`);
const pscDiscrepancyService = new PscDiscrepancyService();

const Session = require(`${serverRoot}/lib/Session`);
let session; // eslint-disable-line no-unused-vars

const routeUtils = require(`${serverRoot}/routes/utils`);
const routeViews = 'report';

let selfLink; // eslint-disable-line no-unused-vars

router.use((req, res, next) => {
  session = new Session(req, res);
  next();
});

router.get('(/report-a-discrepancy)?', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  res.render(`${routeViews}/index.njk`);
});

router.get('/report-a-discrepancy/obliged-entity/contact-name', (req, res, next) => {
  logger.info(`GET request to render obliged entity contact name page: ${req.path}`);
  res.render(`${routeViews}/contact_name.njk`);
});

router.post('/report-a-discrepancy/obliged-entity/contact-name', (req, res) => {
  logger.info('POST request to save obliged entity contact name, with payload: ', req.body);
  validator.isValidContactName(req.body.fullName)
    .then(r => {
      return pscDiscrepancyService.saveContactName(req.body.fullName);
    }).then(r => {
      const o = res.locals.session;
      o.appData.initialServiceResponse = r;
      res.locals.session = o;
      return session.write(o);
    }).then(_ => {
      res.redirect(302, '/report-a-discrepancy/obliged-entity/email');
    }).catch(err => {
      res.render(`${routeViews}/contact_name.njk`, {
        this_errors: routeUtils.processException(err),
        this_data: req.body
      });
    });
});

router.get('/report-a-discrepancy/obliged-entity/email', (req, res, next) => {
  logger.info(`GET request to serve obliged entity email page: ${req.path}`);
  res.render(`${routeViews}/oe_email.njk`);
});

router.post('/report-a-discrepancy/obliged-entity/email', (req, res, next) => {
  logger.info('POST request to save obliged entity email, with payload: ', req.body);
  validator.isValidEmail(req.body.email)
    .then(_ => {
      selfLink = res.locals.session.appData.initialServiceResponse.links.self;
      return pscDiscrepancyService.getReport(selfLink);
    }).then(report => {
      const data = {
        obliged_entity_contact_name: report.obliged_entity_contact_name,
        obliged_entity_email: req.body.email,
        obliged_entity_telephone_number: req.body.phoneNumber.trim(),
        etag: report.etag,
        selfLink: selfLink
      };
      return pscDiscrepancyService.saveEmail(data);
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
  logger.info(`GET request to serve company number page: ${req.path}`);
  res.render(`${routeViews}/company_number.njk`);
});

router.post('/report-a-discrepancy/company-number', (req, res) => {
  logger.info('POST request to save company number, with payload: ', req.body);
  validator.isCompanyNumberFormatted(req.body.number)
    .then(_ => {
      selfLink = res.locals.session.appData.initialServiceResponse.links.self;
      return pscDiscrepancyService.getReport(selfLink);
    }).then(report => {
      const data = {
        obliged_entity_contact_name: report.obliged_entity_contact_name,
        obliged_entity_email: report.obliged_entity_email,
        obliged_entity_telephone_number: report.obliged_entity_telephone_number,
        company_number: req.body.number,
        etag: report.etag,
        selfLink: selfLink
      };
      return pscDiscrepancyService.saveCompanyNumber(data);
    }).then(_ => {
      res.redirect(302, '/report-a-discrepancy/discrepancy-details');
    }).catch(err => {
      res.render(`${routeViews}/company_number.njk`, {
        this_errors: routeUtils.processException(err),
        this_data: req.body
      });
    });
});

router.get('/report-a-discrepancy/discrepancy-details', (req, res) => {
  logger.info(`GET request to serve discrepancy details page: ${req.path}`);
  res.render(`${routeViews}/discrepancy_details.njk`);
});

router.post('/report-a-discrepancy/discrepancy-details', (req, res, next) => {
  logger.info('POST request to save discrepancy details, with payload: ', req.body);
  let data = {}; // eslint-disable-line prefer-const
  validator.isTextareaNotEmpty(req.body.details)
    .then(r => {
      selfLink = res.locals.session.appData.initialServiceResponse.links.self;
      data.details = req.body.details;
      data.selfLink = selfLink;
      return pscDiscrepancyService.saveDiscrepancyDetails(data);
    }).then(_ => {
      return pscDiscrepancyService.getReport(selfLink);
    }).then(report => {
      data.obliged_entity_contact_name = report.obliged_entity_contact_name;
      data.obliged_entity_email = report.obliged_entity_email;
      data.obliged_entity_telephone_number = report.obliged_entity_telephone_number;
      data.company_number = report.company_number;
      data.etag = report.etag;
      return pscDiscrepancyService.saveStatus(data);
    }).then(_ => {
      return session.write({});
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
  logger.info(`GET request to serve confirmation page: ${req.path}`);
  res.render(`${routeViews}/confirmation.njk`);
});

module.exports = router;
