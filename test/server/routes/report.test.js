const logger = require(`${serverRoot}/config/winston`);
const Utility = require(`${serverRoot}/lib/Utility`);
const Session = require(`${serverRoot}/lib/Session`);
const obligedEntityTypes = require(`${serverRoot}/services/data/oe_types`);
const routeUtils = require(`${serverRoot}/routes/utils`);

let stubLogger;

const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;
const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();

const PscDiscrepancyService = require(`${serverRoot}/services/psc_discrepancy`);
const pscDiscrepancyService = new PscDiscrepancyService();

const serviceData = require(`${testRoot}/server/_fakes/data/services/psc_discrepancy`);
const { sessionData } = require(`${testRoot}/server/_fakes/mocks/lib/session`);
const { validationException, viewDataMock, responseMock } = require(`${testRoot}/server/_fakes/mocks`);

const cookieStr = 'PSC_SID=abc123';

const app = require(`${serverRoot}/app`);

describe('routes/report', () => {
  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    sinon.stub(Utility, 'logException').returns(undefined);
    sinon.stub(Session.prototype, '_setUp').returns(undefined);
    sinon.stub(Session.prototype, 'read').returns(Promise.resolve(sessionData));
    sinon.stub(Session.prototype, 'write').returns(Promise.resolve(true));
    stubLogger = sinon.stub(logger, 'info').returns(true);
    done();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  it('should serve up the index page with no mount path', () => {
    const slug = '/';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should serve up the index page on the "/report-a-discrepancy" mount path', () => {
    const slug = '/report-a-discrepancy';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should fail to serve up a page on an unhandled mount path', () => {
    const slug = '/not-a-report-a-discrepancy-url';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(404);
        expect(stubLogger).to.not.have.been.called;
      });
  });

  it('should serve up the obliged entity obliged entity type page', () => {
    const slug = '/report-a-discrepancy/obliged-entity/type';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should process the obliged entity type page payload and redirect to obliged entity organisation name page', () => {
    const slug = '/report-a-discrepancy/obliged-entity/type';
    const stubValidator = sinon.stub(Validator.prototype, 'isValidObligedEntityType').returns(Promise.resolve(true));
    const stubPscService = sinon.stub(PscDiscrepancyService.prototype, 'saveObligedEntityType').returns(Promise.resolve(serviceData.obligedEntityContactNamePost));
    const data = { obligedEntityType: '2' };
    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stubValidator).to.have.been.calledOnce;
        expect(stubValidator).to.have.been.calledWith(data, Object.keys(obligedEntityTypes));
        expect(validator.isValidObligedEntityType(data.obligedEntityType)).to.eventually.equal(true);
        expect(stubPscService).to.have.been.calledOnce;
        expect(stubPscService).to.have.been.calledWith(data.obligedEntityType);
        // expect(pscDiscrepancyService.saveObligedEntityType(obligedEntityTypes[data.obligedEntityType])).to.eventually.eql(serviceData.obligedEntityTypePost);
        expect(response).to.redirectTo(/\/report-a-discrepancy\/obliged-entity\/organisation-name/g);
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledTwice;
      });
  });

  it.only('should return the obliged entity type page with error message if obliged entity type is not selected', () => {
    const data = { obigedEntityType: 'incorrect type' };
    const slug = '/report-a-discrepancy/obliged-entity/type';
    validationException.stack = errorManifest.obligedEntityType.blank;
    const stub = sinon.stub(Validator.prototype, 'isValidObligedEntityType').rejects(validationException);
    const processException = sinon.stub(routeUtils, 'processException').returns(undefined);

    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stubLogger).to.have.been.calledOnce;
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data, Object.keys(obligedEntityTypes));
        expect(validator.isValidObligedEntityType(data, Object.keys(obligedEntityTypes))).to.be.rejectedWith(validationException);
        //expect(processException).to.have.been.calledOnce;
        //expect(processException).to.have.been.calledWith(validationException, viewData, responseMock);
        // expect(response.text).include('Select what type of obliged entity you are');
        //expect(response).to.have.status(200);
      });
  });

  it('should serve up the obliged entity obliged entity type page', () => {
    const slug = '/report-a-discrepancy/obliged-entity/organisation-name';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should process the obliged entity organisation name page payload and redirect to obliged contact email page', () => {
    const slug = '/report-a-discrepancy/obliged-entity/organisation-name';
    const stubValidator = sinon.stub(Validator.prototype, 'isValidOrganisationName').returns(Promise.resolve(true));
    const stubPscServiceGetReport = sinon.stub(PscDiscrepancyService.prototype, 'getReport').returns(Promise.resolve(serviceData.reportDetailsGet));
    const stubPscService = sinon.stub(PscDiscrepancyService.prototype, 'saveOrganisationName').returns(Promise.resolve(serviceData.obligedEntityOrganisationNamePost));
    const data = { organisationName: 'OrgName' };
    const servicePayload = {
      obliged_entity_type: sessionData.appData.initialServiceResponse.obliged_entity_type,
      obliged_entity_organisation_name: data.organisationName,
      etag: sessionData.appData.initialServiceResponse.etag,
      selfLink: sessionData.appData.initialServiceResponse.links.self
    };
    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stubValidator).to.have.been.calledOnce;
        expect(stubValidator).to.have.been.calledWith(data.organisationName);
        expect(validator.isValidOrganisationName(data.organisationName)).to.eventually.equal(true);
        expect(stubPscServiceGetReport).to.have.been.calledOnce;
        expect(stubPscService).to.have.been.calledOnce;
        // expect(stubPscService).to.have.been.calledWith(servicePayload);
        expect(pscDiscrepancyService.saveOrganisationName(servicePayload)).to.eventually.eql(serviceData.obligedEntityOrganisationNamePost);
        expect(response).to.redirectTo(/\/report-a-discrepancy\/obliged-entity\/contact-name/g);
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledTwice;
      });
  });

  it('should return the organisation name page with error message if organisation name is not populated', () => {
    const data = { organisationName: '' };
    validationException.stack = errorManifest.organisationName.empty;
    const slug = '/report-a-discrepancy/obliged-entity/organisation-name';
    const stub = sinon.stub(Validator.prototype, 'isValidOrganisationName').rejects(validationException);
    const processException = sinon.stub(routeUtils, 'processException').returns(validationException.stack);

    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data.organisationName);
        expect(validator.isValidOrganisationName(data.organisationName)).to.be.rejectedWith(validationException);
        expect(response.text).include(data.organisationName);
        expect(processException).to.have.been.calledOnce;
        expect(processException).to.have.been.calledWith(validationException);
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should return the organisation name page with error message if organisation name is not populated', () => {
    const data = { organisationName: '@Invalid%^Name' };
    validationException.stack = errorManifest.organisationName.incorrect;
    const slug = '/report-a-discrepancy/obliged-entity/organisation-name';
    const stub = sinon.stub(Validator.prototype, 'isValidOrganisationName').rejects(validationException);
    const processException = sinon.stub(routeUtils, 'processException').returns(validationException.stack);

    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data.organisationName);
        expect(validator.isValidOrganisationName(data.organisationName)).to.be.rejectedWith(validationException);
        expect(response.text).include(data.organisationName);
        expect(processException).to.have.been.calledOnce;
        expect(processException).to.have.been.calledWith(validationException);
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should serve up the obliged entity contact name page', () => {
    const slug = '/report-a-discrepancy/obliged-entity/contact-name';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should process the obliged entity contact name page payload and redirect to obliged entity email page', () => {
    const slug = '/report-a-discrepancy/obliged-entity/contact-name';
    const stubValidator = sinon.stub(Validator.prototype, 'isValidContactName').returns(Promise.resolve(true));
    const stubPscServiceGetReport = sinon.stub(PscDiscrepancyService.prototype, 'getReport').returns(Promise.resolve(serviceData.reportDetailsGet));
    const stubPscService = sinon.stub(PscDiscrepancyService.prototype, 'saveContactName').returns(Promise.resolve(serviceData.obligedEntityContactNamePost));
    const data = { fullName: 'matt le-matt' };
    const servicePayload = {
      obliged_entity_type: sessionData.appData.initialServiceResponse.obliged_entity_type,
      obliged_entity_contact_name: data.fullName,
      etag: sessionData.appData.initialServiceResponse.etag,
      selfLink: sessionData.appData.initialServiceResponse.links.self
    };
    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stubValidator).to.have.been.calledOnce;
        expect(stubValidator).to.have.been.calledWith(data.fullName);
        expect(validator.isValidContactName(data.fullName)).to.eventually.equal(true);
        expect(stubPscServiceGetReport).to.have.been.calledOnce;
        expect(stubPscService).to.have.been.calledOnce;
        // expect(stubPscService).to.have.been.calledWith(servicePayload);
        expect(pscDiscrepancyService.saveContactName(servicePayload)).to.eventually.eql(serviceData.obligedEntityContactNamePost);
        expect(response).to.redirectTo(/\/report-a-discrepancy\/obliged-entity\/email/g);
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledTwice;
      });
  });

  it('should return the contact name page with error message if contact name is not populated', () => {
    const data = { fullName: '' };
    validationException.stack = errorManifest.fullName.empty;
    const slug = '/report-a-discrepancy/obliged-entity/contact-name';
    const stub = sinon.stub(Validator.prototype, 'isValidContactName').rejects(validationException);
    const processException = sinon.stub(routeUtils, 'processException').returns(validationException.stack);

    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data.fullName);
        expect(validator.isValidContactName(data.fullName)).to.be.rejectedWith(validationException);
        expect(response.text).include(data.fullName);
        expect(processException).to.have.been.calledOnce;
        expect(processException).to.have.been.calledWith(validationException);
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should return the contact name page with error message if contact name is incorrectly formatted', () => {
    const data = { fullName: 'incorrect/name' };
    validationException.stack = errorManifest.fullName.incorrect;
    const slug = '/report-a-discrepancy/obliged-entity/contact-name';
    const stub = sinon.stub(Validator.prototype, 'isValidContactName').rejects(validationException);
    const processException = sinon.stub(routeUtils, 'processException').returns(validationException.stack);
    // const stubPscService = sinon.stub(PscDiscrepancyService.prototype, 'saveContactName').returns(Promise.resolve(serviceData.obligedEntityContactNamePost));

    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data.fullName);
        expect(validator.isValidContactName(data.fullName)).to.be.rejectedWith(validationException);
        expect(response.text).include(data.fullName);
        expect(processException).to.have.been.calledOnce;
        expect(processException).to.have.been.calledWith(validationException);
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should serve up the obliged entity e-mail page with oe-email path', () => {
    const slug = '/report-a-discrepancy/obliged-entity/email';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should process the obliged entity e-mail page payload and redirect to company number page', () => {
    const slug = '/report-a-discrepancy/obliged-entity/email';
    const stubValidator = sinon.stub(Validator.prototype, 'isValidEmail').returns(Promise.resolve(true));
    const stubPscServiceGetReport = sinon.stub(PscDiscrepancyService.prototype, 'getReport').returns(Promise.resolve(serviceData.reportDetailsGet));
    const stubPscServiceSaveEmail = sinon.stub(PscDiscrepancyService.prototype, 'saveEmail').returns(Promise.resolve(serviceData.obligedEntityEmailPost));
    const clientPayload = { email: 'valid@valid.com', phoneNumber: '07777777777' };
    const servicePayload = {
      obliged_entity_email: clientPayload.email,
      obliged_entity_telephone_number: clientPayload.phoneNumber,
      obliged_entity_contact_name: sessionData.appData.initialServiceResponse.obliged_entity_contact_name,
      etag: sessionData.appData.initialServiceResponse.etag,
      selfLink: sessionData.appData.initialServiceResponse.links.self
    };
    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(clientPayload)
      .then(response => {
        expect(stubValidator).to.have.been.calledOnce;
        expect(stubValidator).to.have.been.calledWith(clientPayload.email);
        expect(validator.isValidEmail(clientPayload.email)).to.eventually.equal(true);
        expect(stubPscServiceGetReport).to.have.been.calledOnce;
        expect(stubPscServiceSaveEmail).to.have.been.calledOnce;
        expect(pscDiscrepancyService.saveEmail(servicePayload)).to.eventually.eql(serviceData.obligedEntityEmailPost);
        expect(response).to.redirectTo(/\/report-a-discrepancy\/company-number/g);
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledTwice;
      });
  });

  it('should return the obliged entity email page with error message if email is incorrectly formatted', () => {
    const data = { email: 'incorrect-email-format', phoneNumber: '07777777777' };
    validationException.stack = errorManifest.email.incorrect;
    const slug = '/report-a-discrepancy/obliged-entity/email';
    const stub = sinon.stub(Validator.prototype, 'isValidEmail').rejects(validationException);
    const processException = sinon.stub(routeUtils, 'processException').returns(validationException.stack);

    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data.email);
        expect(validator.isValidEmail(data.email)).to.be.rejectedWith(validationException);
        expect(response.text).include(data.email);
        expect(processException).to.have.been.calledOnce;
        expect(processException).to.have.been.calledWith(validationException);
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should serve up the company number page with company number path', () => {
    const slug = '/report-a-discrepancy/company-number';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should process the company number page payload and redirect to discrepancy details page', () => {
    const slug = '/report-a-discrepancy/company-number';
    const stubValidator = sinon.stub(Validator.prototype, 'isCompanyNumberFormatted').returns(Promise.resolve(true));
    const stubPscServiceGetReport = sinon.stub(PscDiscrepancyService.prototype, 'getReport').returns(Promise.resolve(serviceData.reportDetailsGet));
    const stubPscServiceSaveCompanyNumber = sinon.stub(PscDiscrepancyService.prototype, 'saveCompanyNumber').returns(Promise.resolve(serviceData.companyNumberPost));
    const clientPayload = { number: '12345678' };
    /* const servicePayload = {
      company_number: clientPayload.number,
      obliged_entity_email: serviceData.reportDetailsGet.obliged_entity_email,
      obliged_entity_telephone_number: serviceData.reportDetailsGet.obliged_entity_telephone_number,
      etag: sessionData.appData.initialServiceResponse.etag,
      selfLink: sessionData.appData.initialServiceResponse.links.self
    }; */
    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(clientPayload)
      .then(response => {
        expect(stubValidator).to.have.been.calledOnce;
        expect(stubValidator).to.have.been.calledOnceWith(clientPayload.number);
        expect(validator.isCompanyNumberFormatted(clientPayload.number)).to.eventually.equal(true);
        expect(stubPscServiceGetReport).to.have.been.calledOnce;
        expect(stubPscServiceSaveCompanyNumber).to.have.been.calledOnce;
        expect(response).to.redirectTo(/\/report-a-discrepancy\/psc-name/g);
        expect(stubLogger).to.have.been.calledTwice;
      });
  });

  it('should return company number page with error message if number is incorrectly formatted', () => {
    const data = { number: '123456' };
    validationException.stack = errorManifest.number.incorrect;
    const slug = '/report-a-discrepancy/company-number';
    const stub = sinon.stub(Validator.prototype, 'isCompanyNumberFormatted').rejects(validationException);
    const processException = sinon.stub(routeUtils, 'processException').returns(validationException.stack);

    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data.number);
        expect(validator.isCompanyNumberFormatted(data.number)).to.be.rejectedWith(validationException);
        expect(response.text).include(data.number);
        expect(processException).to.have.been.calledOnce;
        expect(processException).to.have.been.calledWith(validationException);
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should serve up the discrepancy details page with discrepancy-details path', () => {
    const slug = '/report-a-discrepancy/discrepancy-details';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should process the discrepancy details page payload and redirect to the confirmation page', () => {
    const slug = '/report-a-discrepancy/discrepancy-details';
    const stubValidator = sinon.stub(Validator.prototype, 'isTextareaNotEmpty').returns(Promise.resolve(true));
    const stubPscServiceSaveDetails = sinon.stub(PscDiscrepancyService.prototype, 'saveDiscrepancyDetails').returns(Promise.resolve(serviceData.discrepancyDetailsPost));
    const stubPscServiceGetReport = sinon.stub(PscDiscrepancyService.prototype, 'getReport').returns(Promise.resolve(serviceData.reportDetailsGet));
    const stubPscServiceSaveStatus = sinon.stub(PscDiscrepancyService.prototype, 'saveStatus').returns(Promise.resolve(serviceData.reportStatusPost));
    const clientPayload = { details: 'Some details' };
    const servicePayload = {
      details: clientPayload.details,
      selfLink: sessionData.appData.initialServiceResponse.links.self,
      obliged_entity_email: serviceData.reportDetailsGet.obliged_entity_email,
      obliged_entity_telephone_number: serviceData.reportDetailsGet.obliged_entity_telephone_number,
      company_number: serviceData.reportDetailsGet.company_number,
      etag: serviceData.reportDetailsGet.etag
    };
    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(clientPayload)
      .then(response => {
        expect(stubValidator).to.have.been.calledOnce;
        expect(stubValidator).to.have.been.calledWith(clientPayload.details);
        expect(validator.isTextareaNotEmpty(clientPayload.details)).to.eventually.equal(true);
        expect(stubPscServiceSaveDetails).to.have.been.calledOnce;
        expect(stubPscServiceGetReport).to.have.been.calledOnce;
        expect(stubPscServiceSaveStatus).to.have.been.calledOnce;
        expect(pscDiscrepancyService.saveDiscrepancyDetails(servicePayload)).to.eventually.eql(serviceData.discrepancyDetailsPost);
        expect(pscDiscrepancyService.getReport(servicePayload.selfLink)).to.eventually.eql(serviceData.reportDetailsGet);
        expect(pscDiscrepancyService.saveStatus(servicePayload)).to.eventually.eql(serviceData.reportStatusPost);
        expect(response).to.redirectTo(/\/report-a-discrepancy\/confirmation/g);
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledTwice;
      });
  });

  it('should return the discrepancy details page with error message if details are not entered', () => {
    const data = { details: '' };
    validationException.stack = errorManifest.details;
    const slug = '/report-a-discrepancy/discrepancy-details';
    const stub = sinon.stub(Validator.prototype, 'isTextareaNotEmpty').rejects(validationException);
    const processException = sinon.stub(routeUtils, 'processException').returns(validationException.stack);

    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data.details);
        expect(validator.isTextareaNotEmpty(data.details)).to.be.rejectedWith(validationException);
        expect(response.text).include(data.details);
        expect(processException).to.have.been.calledOnce;
        expect(processException).to.have.been.calledWith(validationException);
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should serve up the confirmation page with confirmation path', () => {
    const slug = '/report-a-discrepancy/confirmation';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });

  it('should serve up the error page with incorrect paths not mapped elsewhere', () => {
    const slug = '/report-a-discrepancy/error';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
        expect(stubLogger).to.have.been.calledOnce;
      });
  });
});
