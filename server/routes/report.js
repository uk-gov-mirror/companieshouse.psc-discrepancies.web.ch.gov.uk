const router = require('express').Router();
const logger = require(`${serverRoot}/config/winston`);
const Utility = require(`${serverRoot}/lib/Utility`);

const apiSdk = require('@companieshouse/api-sdk-node');

const obligedEntityTypes = require(`${serverRoot}/services/data/oe_types`);

const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();

const PscDiscrepancyService = require(`${serverRoot}/services/psc_discrepancy`);
const pscDiscrepancyService = new PscDiscrepancyService();

const CacheService = require(`${serverRoot}/services/cache_service`);
const cacheService = new CacheService();

const Session = require(`${serverRoot}/lib/Session`);
let session; // eslint-disable-line no-unused-vars

const routeUtils = require(`${serverRoot}/routes/utils`);
const routeViews = 'report';

let selfLink; // eslint-disable-line no-unused-vars

router.use((req, res, next) => {
  try {
    session = new Session(req, res);
    console.log('@@@ CACHEDDATA   ', JSON.stringify(cacheService.getCachedDataFromSession(req.session)));
    if (typeof cacheService.getCachedDataFromSession(req.session).appData.initialServiceResponse === 'undefined') {
      selfLink = '';
    } else {
      selfLink = cacheService.getCachedDataFromSession(req.session).appData.initialServiceResponse.links.self;
    }
    next();
  } catch (err) {
    routeUtils.processException(err, null, res);
  }
});

router.get('(/report-a-discrepancy)?', (req, res, next) => {
  logger.info(`GET request to serve index page: ${req.path}`);
  res.render(`${routeViews}/index.njk`, { title: routeUtils.setPageTitle('Report a discrepancy about a beneficial owner on the PSC register') });
});

router.get('/report-a-discrepancy/obliged-entity/type', (req, res, next) => {
  logger.info(`GET request to render obliged entity type page: ${req.path}`);
  const viewData = {
    this_data: obligedEntityTypes,
    title: routeUtils.setPageTitle('What type of obliged entity are you?')
  };
  res.render(`${routeViews}/oe_type.njk`, viewData);
});

router.post('/report-a-discrepancy/obliged-entity/type', (req, res, next) => {
  logger.info('POST request to save obliged entity contact type, with payload: ', req.body);
  validator.isValidObligedEntityType(req.body, Object.keys(obligedEntityTypes))
    .then(r => {
      return pscDiscrepancyService.saveObligedEntityType(req.body.obligedEntityType);
    }).then(r => {
      const pscCache = cacheService.getCachedDataFromSession(req.session);
      pscCache.appData.initialServiceResponse = r.data;
      // console.log('@@@@@@@ ', JSON.stringify(r.data));
      cacheService.setPscCache(req.session, pscCache);
      console.log('@@@@@@@ AFTER SET', cacheService.getCachedDataFromSession(req.session));
    }).then(_ => {
      res.redirect(302, '/report-a-discrepancy/obliged-entity/organisation-name');
    }).catch(err => {
      const viewData = {
        this_data: obligedEntityTypes,
        this_errors: null,
        path: `${routeViews}/oe_type.njk`,
        title: routeUtils.setPageTitle('What type of obliged entity are you?')
      };
      routeUtils.processException(err, viewData, res);
    });
});

router.get('/report-a-discrepancy/obliged-entity/organisation-name', (req, res, next) => {
  logger.info(`GET request to render obliged entity organisation name page: ${req.path}`);
  console.log('@@@@@ SESSION AT OE NAME' , JSON.stringify(cacheService.getCachedDataFromSession(req.session)));
  res.render(`${routeViews}/organisation_name.njk`, { title: routeUtils.setPageTitle('What is the name of your organisation?') });
});

router.post('/report-a-discrepancy/obliged-entity/organisation-name', (req, res, next) => {
  logger.info('POST request to save obliged entity organisation name, with payload: ', req.body);
  validator.isValidOrganisationName(req.body.organisationName)
    .then(_ => {
      return pscDiscrepancyService.getReport(selfLink);
    }).then(report => {
      const data = {
        obliged_entity_type: report.data.obliged_entity_type,
        obliged_entity_organisation_name: req.body.organisationName,
        etag: report.data.etag,
        selfLink: selfLink
      };
      return pscDiscrepancyService.saveOrganisationName(data);
    }).then(_ => {
      res.redirect(302, '/report-a-discrepancy/obliged-entity/contact-name');
    }).catch(err => {
      const viewData = {
        this_data: req.body,
        this_errors: null,
        path: `${routeViews}/organisation_name.njk`,
        title: routeUtils.setPageTitle('What is the name of your organisation?')
      };
      routeUtils.processException(err, viewData, res);
    });
});

router.get('/report-a-discrepancy/obliged-entity/contact-name', (req, res, next) => {
  logger.info(`GET request to render obliged entity contact name page: ${req.path}`);
  res.render(`${routeViews}/contact_name.njk`, { title: routeUtils.setPageTitle('What is your name?') });
});

router.post('/report-a-discrepancy/obliged-entity/contact-name', (req, res) => {
  logger.info('POST request to save obliged entity contact name, with payload: ', req.body);
  validator.isValidContactName(req.body.fullName)
    .then(_ => {
      return pscDiscrepancyService.getReport(selfLink);
    }).then(report => {
      const data = {
        obliged_entity_type: report.data.obliged_entity_type,
        obliged_entity_organisation_name: report.data.obliged_entity_organisation_name,
        obliged_entity_contact_name: req.body.fullName,
        etag: report.data.etag,
        selfLink: selfLink
      };
      return pscDiscrepancyService.saveContactName(data);
    }).then(_ => {
      res.redirect(302, '/report-a-discrepancy/obliged-entity/email');
    }).catch(err => {
      const viewData = {
        this_data: req.body,
        this_errors: null,
        path: `${routeViews}/contact_name.njk`,
        title: routeUtils.setPageTitle('What is your name?')
      };
      routeUtils.processException(err, viewData, res);
    });
});

router.get('/report-a-discrepancy/obliged-entity/email', (req, res, next) => {
  logger.info(`GET request to serve obliged entity email page: ${req.path}`);
  res.render(`${routeViews}/oe_email.njk`, { title: routeUtils.setPageTitle('What is your email address?') });
});

router.post('/report-a-discrepancy/obliged-entity/email', (req, res, next) => {
  logger.info('POST request to save obliged entity email, with payload: ', req.body);
  validator.isValidEmail(req.body.email)
    .then(_ => {
      return pscDiscrepancyService.getReport(selfLink);
    }).then(report => {
      const data = {
        obliged_entity_type: report.data.obliged_entity_type,
        obliged_entity_organisation_name: report.data.obliged_entity_organisation_name,
        obliged_entity_contact_name: report.data.obliged_entity_contact_name,
        obliged_entity_email: req.body.email,
        etag: report.data.etag,
        selfLink: selfLink
      };
      return pscDiscrepancyService.saveEmail(data);
    }).then(_ => {
      return res.redirect(302, '/report-a-discrepancy/company-number');
    }).catch(err => {
      const viewData = {
        this_data: req.body,
        this_errors: null,
        path: `${routeViews}/oe_email.njk`,
        title: routeUtils.setPageTitle('What is your email address?')
      };
      routeUtils.processException(err, viewData, res);
    });
});

router.get('/report-a-discrepancy/company-number', (req, res) => {
  logger.info(`GET request to serve company number page: ${req.path}`);
  res.render(`${routeViews}/company_number.njk`, { title: routeUtils.setPageTitle('What is the company number for the PSC with the discrepancy?') });
});

router.post('/report-a-discrepancy/company-number', (req, res) => {
  logger.info('POST request to save company number, with payload: ', req.body);
  const api = apiSdk.createApiClient(process.env.CHS_API_KEY, undefined, process.env.API_URL);
  let secureFlag;
  api.companyProfile.getCompanyProfile(req.body.number.toUpperCase())
    .then(profile => {
      if (profile.httpStatusCode !== 404) {
        secureFlag = !(typeof profile.resource.hasSuperSecurePscs === 'undefined' || profile.resource.hasSuperSecurePscs === false);
      }
      return validator.isCompanyNumberFormatted(req.body.number, profile.httpStatusCode);
    }).then(_ => {
      return pscDiscrepancyService.getReport(selfLink);
    }).then(report => {
      if (secureFlag === false) {
        const data = {
          obliged_entity_type: report.data.obliged_entity_type,
          obliged_entity_organisation_name: report.data.obliged_entity_organisation_name,
          obliged_entity_contact_name: report.data.obliged_entity_contact_name,
          obliged_entity_email: report.data.obliged_entity_email,
          obliged_entity_telephone_number: report.data.obliged_entity_telephone_number,
          company_number: req.body.number,
          etag: report.data.etag,
          selfLink: selfLink
        };
        return pscDiscrepancyService.saveCompanyNumber(data);
      }
    }).then(_ => {
      if (secureFlag === true) {
        return res.redirect(302, '/report-a-discrepancy/secure-psc');
      }
      return res.redirect(302, '/report-a-discrepancy/confirm-company');
    }).catch(err => {
      const viewData = {
        this_data: req.body,
        this_errors: null,
        path: `${routeViews}/company_number.njk`,
        title: routeUtils.setPageTitle('What is the company number for the PSC with the discrepancy?')
      };
      routeUtils.processException(err, viewData, res);
    });
});

router.get('/report-a-discrepancy/secure-psc', (req, res) => {
  logger.info(`GET request to serve secure psc found page: ${req.path}`);
  res.render(`${routeViews}/secure_psc.njk`, { title: routeUtils.setPageTitle('A PSC for this company has details protected') });
});

router.get('/report-a-discrepancy/confirm-company', (req, res) => {
  logger.info(`GET request to serve company confirmation page: ${req.path}`);
  const viewData = {
    title: routeUtils.setPageTitle('Confirm this is the correct company'),
    this_data: {},
    path: `${routeViews}/company_confirmation.njk`
  };
  const api = apiSdk.createApiClient(process.env.CHS_API_KEY, undefined, process.env.API_URL);
  pscDiscrepancyService.getReport(selfLink)
    .then(report => {
      viewData.this_data.company_number = report.data.company_number.toUpperCase();
      return api.companyProfile.getCompanyProfile(report.data.company_number.toUpperCase());
    }).then(profile => {
      viewData.this_data.company_name = profile.resource.companyName;
      viewData.this_data.company_status = profile.resource.companyStatus.charAt(0).toUpperCase() + profile.resource.companyStatus.slice(1);
      viewData.this_data.company_type = profile.resource.type.charAt(0).toUpperCase() + profile.resource.type.slice(1);
      // Format date of incorporation
      const dayOfIncorporation = profile.resource.dateOfCreation.slice(-2);
      const monthOfIncorporation = profile.resource.dateOfCreation.slice(5, 7);
      const yearOfIncorporation = profile.resource.dateOfCreation.slice(0, 4);
      const months = Utility.getMonthsOfYear();
      viewData.this_data.incorporation_date = dayOfIncorporation + ' ' + months[parseInt(monthOfIncorporation)] + ' ' + yearOfIncorporation;
      viewData.this_data.address_line_1 = profile.resource.registeredOfficeAddress.addressLineOne;
      viewData.this_data.postal_code = profile.resource.registeredOfficeAddress.postalCode;
    }).then(_ => {
      res.render(viewData.path, viewData);
    }).catch(err => {
      routeUtils.processException(err, viewData, res);
    });
});

router.post('/report-a-discrepancy/confirm-company', (req, res) => {
  logger.info('POST request to confirm company number is correct: ', req.body);
  res.redirect(302, '/report-a-discrepancy/psc-name');
});

router.get('/report-a-discrepancy/psc-name', (req, res) => {
  logger.info(`GET request to serve PSC name page: ${req.path}`);
  const viewData = {
    title: routeUtils.setPageTitle('Which PSC is incorrect for ?'),
    this_data: {},
    path: `${routeViews}/psc_name.njk`
  };
  const api = apiSdk.createApiClient(process.env.CHS_API_KEY, undefined, process.env.API_URL);
  pscDiscrepancyService.getReport(selfLink)
    .then(report => {
      return api.companyProfile.getCompanyProfile(report.data.company_number.toUpperCase());
    })
    .then(profile => {
      viewData.this_data.organisationName = profile.resource.companyName;
      viewData.title = routeUtils.setPageTitle('Which PSC is incorrect for ' + profile.resource.companyName + '?');
      return api.companyPsc.getCompanyPsc(profile.resource.companyNumber.toUpperCase());
    })
    .then(result => {
      const pscs = {};
      if (typeof result.resource !== 'undefined' && typeof result.resource.items !== 'undefined') {
        const months = Utility.getMonthsOfYear();
        let psc;
        for (const [i, o] of result.resource.items.entries()) { // eslint-disable-line no-unused-vars
          psc = o;
          if (typeof o.dateOfBirth === 'undefined') {
            psc.dob = '';
            psc.dobView = 'Date of birth not available';
          } else {
            psc.dob = `${o.dateOfBirth.month.toString().padStart(2, '0')}/${o.dateOfBirth.year}`;
            psc.dobView = `Born ${months[o.dateOfBirth.month]} ${o.dateOfBirth.year}`;
          }
          pscs[`psc_${i}${Utility.getRandomString(5, 7)}`] = psc;
        }
      }
      viewData.this_data.pscs = pscs;
      const o = res.locals.session;
      o.appData.pscs = pscs;
      res.locals.session = o;
      return session.write(o);
    }).then(_ => {
      res.render(viewData.path, viewData);
    }).catch(err => {
      routeUtils.processException(err, viewData, res);
    });
});

router.post('/report-a-discrepancy/psc-name', (req, res) => {
  logger.info('POST request to save PSC name, with payload: ', req.body);
  const pscs = res.locals.session.appData.pscs;
  const viewData = {
    this_data: {
      pscs: pscs
    },
    path: `${routeViews}/psc_name.njk`,
    title: routeUtils.setPageTitle('PSC information')
  };
  pscDiscrepancyService.getReport(selfLink)
    .then(report => {
      viewData.this_data.organisationName = report.data.obliged_entity_organisation_name;
      return validator.isValidPscName(req.body, pscs);
    }).then(_ => {
      const pscName = req.body.pscName;
      let pscDetails = {};
      const kinds = ['individual-person-with-significant-control', 'corporate-entity-person-with-significant-control', 'legal-person-person-with-significant-control'];
      if (pscName !== 'PSC missing') {
        pscDetails = pscs[pscName];
        if (!kinds.includes(pscDetails.kind)) {
          pscDetails.pscDiscrepancyTypes = ['Other reason'];
          viewData.path = '/report-a-discrepancy/discrepancy-details';
        } else {
          viewData.path = '/report-a-discrepancy/psc-discrepancy-types';
        }
      } else if (pscName === 'PSC missing') {
        pscDetails.name = pscName;
        pscDetails.dob = '';
        viewData.path = '/report-a-discrepancy/discrepancy-details';
      }
      const o = res.locals.session;
      o.appData.selectedPscDetails = pscDetails;
      res.locals.session = o;
      return session.write(o);
    }).then(_ => {
      res.redirect(302, viewData.path);
    }).catch(err => {
      routeUtils.processException(err, viewData, res);
    });
});

router.get('/report-a-discrepancy/psc-discrepancy-types', (req, res) => {
  logger.info(`GET request to serve discrepancy types page: ${req.path}`);
  const viewData = {
    this_data: {
      psc: res.locals.session.appData.selectedPscDetails,
      discrepancies: routeUtils.setDiscrepancyTypes(res)
    },
    title: routeUtils.setPageTitle('What type of discrepancy are you reporting?')
  };
  if (viewData.this_data.discrepancies !== null) {
    res.render(`${routeViews}/psc_discrepancy_types.njk`, viewData);
  } else {
    res.render('_partials/error.njk');
  }
});

router.post('/report-a-discrepancy/psc-discrepancy-types', (req, res) => {
  logger.info(`POST request to save discrepancies to the session: ${req.path}`);
  validator.isValidDiscrepancyTypeSelection(req.body).then(_ => {
    const pscDetails = res.locals.session.appData.selectedPscDetails;
    pscDetails.pscDiscrepancyTypes = req.body.discrepancy;
    const o = res.locals.session;
    session.write(o);
  }).then(_ => {
    res.redirect(302, '/report-a-discrepancy/discrepancy-details');
  }).catch(err => {
    const viewData = {
      this_data: {
        psc: res.locals.session.appData.selectedPscDetails,
        discrepancies: routeUtils.setDiscrepancyTypes(res)
      },
      path: `${routeViews}/psc_discrepancy_types.njk`,
      title: routeUtils.setPageTitle('What type of discrepancy are you reporting?')
    };
    routeUtils.processException(err, viewData, res);
  });
});

router.get('/report-a-discrepancy/discrepancy-details', (req, res) => {
  logger.info(`GET request to serve discrepancy details page: ${req.path}`);
  res.render(`${routeViews}/discrepancy_details.njk`, { title: routeUtils.setPageTitle('Give us more information about the discrepancy') });
});

router.post('/report-a-discrepancy/discrepancy-details', (req, res) => {
  logger.info('POST request to save discrepancy details to session, with payload: ', req.body);
  validator.isTextareaNotEmpty(req.body.details)
    .then(_ => {
      const selectedPscDetails = res.locals.session.appData.selectedPscDetails;
      selectedPscDetails.details = req.body.details;
      res.locals.session.appData.selectedPscDetails = selectedPscDetails;
      const o = res.locals.session;
      return session.write(o);
    }).then(_ => {
      res.redirect(302, '/report-a-discrepancy/check-your-answers');
    }).catch(err => {
      const viewData = {
        this_data: req.body,
        this_errors: null,
        path: `${routeViews}/discrepancy_details.njk`,
        title: routeUtils.setPageTitle('Give us more information about the discrepancy')
      };
      routeUtils.processException(err, viewData, res);
    });
});

router.get('/report-a-discrepancy/check-your-answers', (req, res) => {
  logger.info(`GET request to serve check your answers page: ${req.path}`);
  const viewData = {
    title: routeUtils.setPageTitle('Check your answers before submitting your report'),
    this_data: {},
    path: `${routeViews}/check-your-answers.njk`
  };
  const api = apiSdk.createApiClient(process.env.CHS_API_KEY, undefined, process.env.API_URL);
  pscDiscrepancyService.getReport(selfLink)
    .then(report => {
      viewData.this_data.contactName = report.data.obliged_entity_contact_name;
      viewData.this_data.contactEmail = report.data.obliged_entity_email;
      viewData.this_data.organisationName = report.data.obliged_entity_organisation_name;
      viewData.this_data.organisationType = obligedEntityTypes[report.data.obliged_entity_type];
      viewData.this_data.companyNumber = report.data.company_number.toUpperCase();
      return api.companyProfile.getCompanyProfile(report.data.company_number.toUpperCase());
    }).then(profile => {
      viewData.this_data.companyName = profile.resource.companyName;
      viewData.this_data.companyNumber = profile.resource.companyNumber;
      const session = res.locals.session;
      viewData.this_data.pscName = session.appData.selectedPscDetails.name;
      viewData.this_data.pscDiscrepancyTypes = session.appData.selectedPscDetails.pscDiscrepancyTypes;
      viewData.this_data.additionalDetails = session.appData.selectedPscDetails.details;
    }).then(_ => {
      res.render(viewData.path, viewData);
    }).catch(err => {
      routeUtils.processException(err, viewData, res);
    });
});

router.post('/report-a-discrepancy/check-your-answers', (req, res) => {
  logger.info('POST request to save details from check your answers page, with payload: ', req.body);

  const data = {};
  const selectedPscDetails = res.locals.session.appData.selectedPscDetails;
  data.psc_name = selectedPscDetails.name;
  data.psc_date_of_birth = selectedPscDetails.dob;
  data.details = selectedPscDetails.details;
  data.psc_discrepancy_types = selectedPscDetails.pscDiscrepancyTypes;
  data.selfLink = selfLink;

  pscDiscrepancyService.saveDiscrepancyDetails(data)
    .then(_ => {
      return pscDiscrepancyService.getReport(selfLink);
    }).then(report => {
      data.obliged_entity_type = report.data.obliged_entity_type;
      data.obliged_entity_organisation_name = report.data.obliged_entity_organisation_name;
      data.obliged_entity_contact_name = report.data.obliged_entity_contact_name;
      data.obliged_entity_email = report.data.obliged_entity_email;
      data.company_number = report.data.company_number;
      data.etag = report.data.etag;
      return pscDiscrepancyService.saveStatus(data);
    }).then(_ => {
      res.redirect(302, '/report-a-discrepancy/confirmation');
    }).catch(err => {
      const viewData = {
        this_data: req.body,
        this_errors: null,
        path: `${routeViews}/check-your-answers.njk`,
        title: routeUtils.setPageTitle('Check your answers before submitting your report')
      };
      routeUtils.processException(err, viewData, res);
    });
});

router.get('/report-a-discrepancy/confirmation', (req, res) => {
  logger.info(`GET request to serve confirmation page: ${req.path}`);
  const viewData = {
    title: routeUtils.setPageTitle('Confirmation page'),
    this_data: {},
    path: `${routeViews}/confirmation.njk`
  };
  pscDiscrepancyService.getReport(selfLink)
    .then(report => {
      viewData.this_data.submissionReference = report.data.submission_reference;
    })
    .then(_ => {
      const o = res.locals.session;
      o.appData = {};
      res.locals.session = o;
      return session.write(o);
    })
    .then(_ => {
      res.render(viewData.path, viewData);
    }).catch(err => {
      routeUtils.processException(err, viewData, res);
    });
});

router.get('/report-a-discrepancy/accessibility', (req, res) => {
  logger.info(`GET request to serve accessibility-statement: ${req.path}`);
  res.render('report/accessibility.njk', { title: routeUtils.setPageTitle('Accessibility Statement') });
});

router.get('/report-a-discrepancy/**', (req, res) => {
  logger.info(`GET request to show NOT FOUND page: ${req.path}`);
  res.render('_partials/error.njk');
});

module.exports = router;
