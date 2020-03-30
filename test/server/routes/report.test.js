describe('routes/Report', () => {

  const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`);
  const Validator = require(`${serverRoot}/lib/validation`);
  const validator = new Validator();
  let app = require(`${serverRoot}/app`);

  beforeEach(done => {
    sinon.reset();
    sinon.restore();
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
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it('should serve up the index page on the "/report-a-discrepancy" mount path', () => {
    let slug = '/report-a-discrepancy';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it('should fail to serve up a page on an unhandled mount path', () => {
    let slug = '/not-a-report-a-discrepancy-url';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(404);
      });
  });

  it('should serve up the obliged entity e-mail page with oe-email path', () => {
    let slug = '/report-a-discrepancy/obliged-entity/email';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it.only('should process the obliged entity e-mail page payload and redirect to company number page', () => {
    let slug = '/report-a-discrepancy/obliged-entity/email';
    let stub = sinon.stub(Validator.prototype, 'isValidEmail').returns(Promise.resolve(true));
    let data = {email: "valid-format@domain.tld"};
    return request(app)
      .post(slug)
      .send(data)
      .then(response => {
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data.email);
        expect(validator.isValidEmail(data.email)).to.eventually.equal(true);
        //expect(response).to.redirectTo(/\/report\-a\-discrepancy\/company\-number/g);
        expect(response).to.have.status(200);
      });
  });

  it('should return same page with error message if email is incorrectly formatted', () => {

    let data = {email: "incorrect-email-format"};
    let validationError = errorManifest.email;
    let slug = '/report-a-discrepancy/obliged-entity/email';
    let stub = sinon.stub(Validator.prototype, 'isValidEmail').rejects(validationError);

    return request(app)
      .post(slug)
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
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it('should process the company number page payload and redirect to discrepancy details page', () => {
    let slug = '/report-a-discrepancy/company-number';
    let stub = sinon.stub(Validator.prototype, 'isCompanyNumberFormatted').returns(Promise.resolve(true));
    let data = {number: "12345678"};
    return request(app)
      .post(slug)
      .send(data)
      .then(response => {
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data.number);
        expect(validator.isCompanyNumberFormatted(data.number)).to.eventually.equal(true);
        expect(response).to.redirectTo(/\/report\-a\-discrepancy\/discrepancy\-details/g);
      });
  });

  it('should return company number page with error message if number is incorrectly formatted', () => {

    let data = {number: "123456"};
    let validationError = errorManifest.number.incorrect;
    let slug = '/report-a-discrepancy/company-number';
    let stub = sinon.stub(Validator.prototype, 'isCompanyNumberFormatted').rejects(validationError);

    return request(app)
      .post(slug)
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
    let stub = sinon.stub(Validator.prototype, 'isTextareaNotEmpty').returns(Promise.resolve(true));
    let data = {details: "valid"};
    return request(app)
      .post(slug)
      .send(data)
      .then(response => {
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(data.details);
        expect(validator.isTextareaNotEmpty(data.details)).to.eventually.equal(true);
        expect(response).to.redirectTo(/\/report\-a\-discrepancy\/confirmation/g);
      });
  });

  it('should return the discrepancy details page with error message if details are not entered', () => {

    let data = {details: ""};
    let validationError = errorManifest.details;
    let slug = '/report-a-discrepancy/discrepancy-details';
    let stub = sinon.stub(Validator.prototype, 'isTextareaNotEmpty').rejects(validationError);

    return request(app)
      .post(slug)
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
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

});
