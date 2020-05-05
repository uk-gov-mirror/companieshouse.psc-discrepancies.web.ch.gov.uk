describe('lib/Utility', () => {
  const logger = require(`${serverRoot}/config/winston`);
  const { genericServerException, serviceException, validationException, exceptionWithNoStatus } = require(`${testRoot}/server/_fakes/mocks`);

  const ModuleUnderTest = require(`${serverRoot}/lib/Utility`);

  beforeEach(() => {
    sinon.reset();
    sinon.restore();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  describe('get randomString', () => {
    it('should return a random alphanumeric string', () => {
      expect(ModuleUnderTest.getRandomString(5, 8)).to.have.lengthOf.within(5, 8);
    });
  });

  describe('log an exception', () => {
    it('should correctly log a generic server exception', () => {
      const stubLogger = sinon.stub(logger, 'error').returns(true);
      expect(ModuleUnderTest.logException(genericServerException)).to.be.undefined;
      expect(stubLogger).to.have.been.calledOnce;
    });

    it('should correctly log a service exception', () => {
      const stubLogger = sinon.stub(logger, 'error').returns(true);
      expect(ModuleUnderTest.logException(serviceException)).to.be.undefined;
      expect(stubLogger).to.have.been.calledOnce;
    });

    it('should correctly log a validation exception', () => {
      const stubLogger = sinon.stub(logger, 'error').returns(true);
      expect(ModuleUnderTest.logException(validationException)).to.be.undefined;
      expect(stubLogger).to.have.been.calledOnce;
    });

    it('should correctly log an exception with no status or statusCode fields', () => {
      const stubLogger = sinon.stub(logger, 'error').returns(true);
      expect(ModuleUnderTest.logException(exceptionWithNoStatus)).to.be.undefined;
      expect(stubLogger).to.have.been.calledOnce;
    });
  });
});
