describe('routes/Report', () => {

  const errorManifest = require(`${serverRoot}/lib/validation/error_manifest`);
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

  it('should validate a correctly formatted email', () => {
    let errors = {};
    errors.email = errorManifest.email;
    expect(validator.isValidEmail('matt.com')).to.be.rejectedWith(errors);
    expect(validator.isValidEmail('')).to.be.rejectedWith(errors);
    expect(validator.isValidEmail(undefined)).to.be.rejectedWith(errors);
    expect(validator.isValidEmail(null)).to.be.rejectedWith(errors);
  });
});
