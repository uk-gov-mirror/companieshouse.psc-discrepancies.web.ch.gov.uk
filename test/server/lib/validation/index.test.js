describe('server/lib/validation/index', () => {

  const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`);
  const Validator = require(`${serverRoot}/lib/validation`);
  const validator = new Validator();

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

  it('should validate a correctly formatted email', () => {
    expect(validator.isValidEmail('matt@matt.com')).to.eventually.equal(true);
    expect(validator.isValidEmail('matt-matt@matt.com')).to.eventually.equal(true);
  });

  it('should validate and return an error if email address is not correctly formatted', () => {
    let errors = {};
    errors.email = errorManifest.email.incorrect;
    expect(validator.isValidEmail('matt.com')).to.be.rejectedWith(errors);
  });

  it('should validate and return an error for blank email addresses', () => {
    let errors = {};
    errors.email = errorManifest.email.blank;
    expect(validator.isValidEmail('')).to.be.rejectedWith(errors);
    expect(validator.isValidEmail(undefined)).to.be.rejectedWith(errors);
    expect(validator.isValidEmail(null)).to.be.rejectedWith(errors);
  });

  it('should validate textarea has alphabetic text entered', () => {
    expect(validator.isTextareaNotEmpty('some text')).to.eventually.equal(true);
    expect(validator.isTextareaNotEmpty('some text and the number 1')).to.eventually.equal(true);
    expect(validator.isTextareaNotEmpty('1 and some text')).to.eventually.equal(true);
  });

  it('should validate textarea has no text or numbers only', () => {
    let errors = {};
    errors.details = errorManifest.details;
    expect(validator.isTextareaNotEmpty('')).to.be.rejectedWith(errors);
    expect(validator.isTextareaNotEmpty('123')).to.be.rejectedWith(errors);
    expect(validator.isTextareaNotEmpty(undefined)).to.be.rejectedWith(errors);
    expect(validator.isTextareaNotEmpty(null)).to.be.rejectedWith(errors);
  });

  it('should validate that the company number entered is 8 characters long', () => {
    expect(validator.isCompanyNumberFormatted('12345678')).to.eventually.equal(true);
    expect(validator.isCompanyNumberFormatted('AB123456')).to.eventually.equal(true);
  });

  it('should validate company number has no text or is undefined or null', () => {
    let errors = {};
    errors.number = errorManifest.number.empty;
    expect(validator.isCompanyNumberFormatted('')).to.be.rejectedWith(errors);
    expect(validator.isCompanyNumberFormatted(undefined)).to.be.rejectedWith(errors);
    expect(validator.isCompanyNumberFormatted(null)).to.be.rejectedWith(errors);
  });

  it('should validate company number is 8 characters long', () => {
    let errors = {};
    errors.number = errorManifest.number.incorrect;
    expect(validator.isCompanyNumberFormatted('1234567')).to.be.rejectedWith(errors);
    expect(validator.isCompanyNumberFormatted('123456789')).to.be.rejectedWith(errors);
  });
});
