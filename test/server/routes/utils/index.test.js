describe('routes/utils/defaultRouteUtil', () => {
  const Utility = require(`${serverRoot}/lib/Utility`);
  const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).generic;

  const { validationException, serviceException, genericServerException, exceptionWithNoStatus } = require(`${testRoot}/server/_fakes/mocks`);

  const ModuleUnderTest = require(`${serverRoot}/routes/utils`);

  beforeEach(() => {
    sinon.reset();
    sinon.restore();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  describe('correctly process exceptions as thrown by a route', () => {
    let stubExceptionLogger;
    const processedException = {
      genericError: errorManifest.serverError
    };
    beforeEach(() => {
      stubExceptionLogger = sinon.stub(Utility, 'logException').returns(true);
    });

    it('should return the error stack of a validation exception thrown by a route', () => {
      expect(ModuleUnderTest.processException(validationException)).to.eql(validationException.stack);
      expect(stubExceptionLogger).to.have.been.calledOnce;
      expect(stubExceptionLogger).to.have.been.calledWith(validationException);
    });
    it('should handle a service exception thrown by a route', () => {
      expect(ModuleUnderTest.processException(serviceException)).to.eql(processedException);
      expect(stubExceptionLogger).to.have.been.calledOnce;
      expect(stubExceptionLogger).to.have.been.calledWith(serviceException);
    });
    it('should handle a generic server exception thrown by a route', () => {
      expect(ModuleUnderTest.processException(genericServerException)).to.eql(processedException);
      expect(stubExceptionLogger).to.have.been.calledOnce;
      expect(stubExceptionLogger).to.have.been.calledWith(genericServerException);
    });
    it('should gracefully handle an exception with no status field thrown by a route', () => {
      expect(ModuleUnderTest.processException(exceptionWithNoStatus)).to.eql(processedException);
      expect(stubExceptionLogger).to.have.been.calledOnce;
      expect(stubExceptionLogger).to.have.been.calledWith(exceptionWithNoStatus);
    });
  });
});
