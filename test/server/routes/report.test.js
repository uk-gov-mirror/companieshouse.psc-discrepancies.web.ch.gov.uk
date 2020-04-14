const Utility = require(`${serverRoot}/lib/Utility`);
const Session = require(`${serverRoot}/lib/Session`);
let session, stubSession;

const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;
const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();

const PscDiscrepancyService = require(`${serverRoot}/services/psc_discrepancy`);
const pscDiscrepancyService = new PscDiscrepancyService();

const serviceData = require(`${testRoot}/server/_fakes/data/services/psc_discrepancy`);
const { sessionData } = require(`${testRoot}/server/_fakes/mocks/lib/session`);

const cookieStr = 'PSC_SID=abc123';

let app = require(`${serverRoot}/app`);

describe('routes/Report', () => {

  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    sinon.stub(Utility, 'logException').returns(undefined);
    sinon.stub(Session.prototype, '_setUp').returns(undefined);
    sinon.stub(Session.prototype, 'read').returns(Promise.resolve(sessionData));
    sinon.stub(Session.prototype, 'write').returns(Promise.resolve(true));
    done();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  it('should serve up the index page with no mount path', () => {
    let slug = '/';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the index page on the "/report-a-discrepancy" mount path', () => {
    let slug = '/report-a-discrepancy';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it('should fail to serve up a page on an unhandled mount path', () => {
    let slug = '/not-a-report-a-discrepancy-url';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(404);
      });
  });

  it('should serve up the obliged entity e-mail page with oe-email path', () => {
    let slug = '/report-a-discrepancy/obliged-entity/email';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it('should process the obliged entity e-mail page payload and redirect to company number page', () => {
    let slug = '/report-a-discrepancy/obliged-entity/email';
    let stubValidator = sinon.stub(Validator.prototype, 'isValidEmail').returns(Promise.resolve(true));
    let stubPscService = sinon.stub(PscDiscrepancyService.prototype, 'saveEmail').returns(Promise.resolve(serviceData.obligedEntityEmailPost));
    let data = { email: "valid-format@domain.tld" };
    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stubValidator).to.have.been.calledOnce;
        expect(stubValidator).to.have.been.calledWith(data.email);
        expect(validator.isValidEmail(data.email)).to.eventually.equal(true);
        expect(stubPscService).to.have.been.calledOnce;
        expect(stubPscService).to.have.been.calledWith(data.email);
        expect(pscDiscrepancyService.saveEmail(data.email)).to.eventually.eql(serviceData.obligedEntityEmailPost);
        expect(response).to.redirectTo(/\/report\-a\-discrepancy\/company\-number/g);
        expect(response).to.have.status(200);
      });
  });

  it('should return same page with error message if email is incorrectly formatted', () => {

    let data = { email: "incorrect-email-format" };
    let validationError = errorManifest.email;
    let slug = '/report-a-discrepancy/obliged-entity/email';
    let stub = sinon.stub(Validator.prototype, 'isValidEmail').rejects(validationError);

    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data.email);
        expect(validator.isValidEmail(data.email)).to.be.rejectedWith(validationError);
        expect(response.text).include(data.email);
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the company number page with company number path', () => {
    let slug = '/report-a-discrepancy/company-number';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it('should process the company number page payload and redirect to discrepancy details page', () => {
    let slug = '/report-a-discrepancy/company-number';
    let stubValidator = sinon.stub(Validator.prototype, 'isCompanyNumberFormatted').returns(Promise.resolve(true));
    let stubPscServiceGetReport = sinon.stub(PscDiscrepancyService.prototype, 'getReport').returns(Promise.resolve(serviceData.reportDetailsGet));
    let stubPscServiceSaveCompanyNumber = sinon.stub(PscDiscrepancyService.prototype, 'saveCompanyNumber').returns(Promise.resolve(serviceData.companyNumberPost));
    let clientPayload = { number: "12345678" };
    let servicePayload = {
      company_number: clientPayload.number,
      obliged_entity_email: sessionData.appData.initialServiceResponse.obliged_entity_email,
      etag: sessionData.appData.initialServiceResponse.etag,
      selfLink: sessionData.appData.initialServiceResponse.links.self
    }
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
        expect(response).to.redirectTo(/\/report\-a\-discrepancy\/discrepancy\-details/g);
      });
  });

  it('should return company number page with error message if number is incorrectly formatted', () => {

    let data = { number: "123456" };
    let validationError = errorManifest.number.incorrect;
    let slug = '/report-a-discrepancy/company-number';
    let stub = sinon.stub(Validator.prototype, 'isCompanyNumberFormatted').rejects(validationError);

    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data.number);
        expect(validator.isCompanyNumberFormatted(data.number)).to.be.rejectedWith(validationError);
        expect(response.text).include(data.number);
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the discrepancy details page with discrepancy-details path', () => {
    let slug = '/report-a-discrepancy/discrepancy-details';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it('should process the discrepancy details page payload and redirect to the confirmation page', () => {
    let slug = '/report-a-discrepancy/discrepancy-details';
    let stubValidator = sinon.stub(Validator.prototype, 'isTextareaNotEmpty').returns(Promise.resolve(true));
    let stubPscService = sinon.stub(PscDiscrepancyService.prototype, 'saveDiscrepancyDetails').returns(Promise.resolve(serviceData.discrepancyDetailsPost));
    let clientPayload = { details: "Some details" };
    let servicePayload = {
      details: clientPayload.details,
      selfLink: sessionData.appData.initialServiceResponse.links.self
    }
    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(clientPayload)
      .then(response => {
        expect(stubValidator).to.have.been.calledOnce;
        expect(stubValidator).to.have.been.calledWith(clientPayload.details);
        expect(validator.isTextareaNotEmpty(clientPayload.details)).to.eventually.equal(true);
        expect(stubPscService).to.have.been.calledOnce;
        expect(pscDiscrepancyService.saveDiscrepancyDetails(servicePayload)).to.eventually.eql(serviceData.discrepancyDetailsPost);
        expect(response).to.redirectTo(/\/report\-a\-discrepancy\/confirmation/g);
        expect(response).to.have.status(200);
      });
  });

  it('should return the discrepancy details page with error message if details are not entered', () => {

    let data = { details: "" };
    let validationError = errorManifest.details;
    let slug = '/report-a-discrepancy/discrepancy-details';
    let stub = sinon.stub(Validator.prototype, 'isTextareaNotEmpty').rejects(validationError);

    return request(app)
      .post(slug)
      .set('Cookie', cookieStr)
      .send(data)
      .then(response => {
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data.details);
        expect(validator.isTextareaNotEmpty(data.details)).to.be.rejectedWith(validationError);
        expect(response.text).include(data.details);
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the confirmation page with confirmation path', () => {
    let slug = '/report-a-discrepancy/confirmation';
    return request(app)
      .get(slug)
      .set('Cookie', cookieStr)
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

});
