const logger = require(`${serverRoot}/config/winston`);
const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;
const Validator = require(`${serverRoot}/lib/validation`);
const validator = new Validator();
const obligedEntityTypes = require(`${serverRoot}/services/data/oe_types`);

describe('server/lib/validation/index', () => {
  let stubLogger;

  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    stubLogger = sinon.stub(logger, 'info').returns(true);
    done();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  it('should validate a correct obliged entity type', () => {
    const data = { obligedEntityType: 'financial' };
    expect(validator.isValidObligedEntityType(data, Object.keys(obligedEntityTypes))).to.eventually.equal(true);
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should validate and return an error if an incorrect obliged entity type is supplied', () => {
    const data = { obligedEntityType: 'incorrect type' };
    const errors = {};
    errors.obligedEntityType = errorManifest.obligedEntityType.blank;
    expect(validator.isValidObligedEntityType(data, Object.keys(obligedEntityTypes))).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should validate a correctly formatted contact name', () => {
    expect(validator.isValidContactName('valid name')).to.eventually.equal(true);
    expect(validator.isValidContactName('valid hyphenated-name')).to.eventually.equal(true);
    expect(validator.isValidContactName('valid quoted\'name')).to.eventually.equal(true);
    expect(stubLogger).to.have.been.calledThrice;
  });

  it('should validate and return an error if contact name is not correctly formatted', () => {
    const errors = {};
    errors.fullName = errorManifest.fullName.incorrect;
    expect(validator.isValidContactName('-日女子أَبْجَدِيّ')).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should validate and return an error for blank contact name', () => {
    const errors = {};
    errors.fullName = errorManifest.fullName.blank;
    expect(validator.isValidContactName('')).to.be.rejectedWith(errors);
    expect(validator.isValidContactName(undefined)).to.be.rejectedWith(errors);
    expect(validator.isValidContactName(null)).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.calledThrice;
  });

  it('should validate a correctly formatted email', () => {
    expect(validator.isValidEmail('matt@matt.com')).to.eventually.equal(true);
    expect(validator.isValidEmail('matt-matt@matt.com')).to.eventually.equal(true);
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('should validate and return an error if email address is not correctly formatted', () => {
    const errors = {};
    errors.email = errorManifest.email.incorrect;
    expect(validator.isValidEmail('matt.com')).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should validate and return an error for blank email addresses', () => {
    const errors = {};
    errors.email = errorManifest.email.blank;
    expect(validator.isValidEmail('')).to.be.rejectedWith(errors);
    expect(validator.isValidEmail(undefined)).to.be.rejectedWith(errors);
    expect(validator.isValidEmail(null)).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.calledThrice;
  });

  it('should validate textarea has alphabetic text entered', () => {
    expect(validator.isTextareaNotEmpty('some text')).to.eventually.equal(true);
    expect(validator.isTextareaNotEmpty('some text and the number 1')).to.eventually.equal(true);
    expect(validator.isTextareaNotEmpty('1 and some text')).to.eventually.equal(true);
    expect(stubLogger).to.have.been.calledThrice;
  });

  it('should validate textarea has no text or numbers only', () => {
    const errors = {};
    errors.details = errorManifest.details;
    expect(validator.isTextareaNotEmpty('')).to.be.rejectedWith(errors);
    expect(validator.isTextareaNotEmpty('123')).to.be.rejectedWith(errors);
    expect(validator.isTextareaNotEmpty(undefined)).to.be.rejectedWith(errors);
    expect(validator.isTextareaNotEmpty(null)).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.callCount(4);
  });

  it('should validate that the company number entered is 8 characters long', () => {
    expect(validator.isCompanyNumberFormatted('12345678')).to.eventually.equal(true);
    expect(validator.isCompanyNumberFormatted('AB123456')).to.eventually.equal(true);
    expect(stubLogger).to.have.been.calledTwice;
  });

  it('should validate company number has no text or is undefined or null', () => {
    const errors = {};
    errors.number = errorManifest.number.empty;
    expect(validator.isCompanyNumberFormatted('')).to.be.rejectedWith(errors);
    expect(validator.isCompanyNumberFormatted(undefined)).to.be.rejectedWith(errors);
    expect(validator.isCompanyNumberFormatted(null)).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.calledThrice;
  });

  it('should validate company number is 8 characters long', () => {
    const errors = {};
    errors.number = errorManifest.number.incorrect;
    expect(validator.isCompanyNumberFormatted('1234567')).to.be.rejectedWith(errors);
    expect(validator.isCompanyNumberFormatted('123456789')).to.be.rejectedWith(errors);
    expect(stubLogger).to.have.been.calledTwice;
  });
});
