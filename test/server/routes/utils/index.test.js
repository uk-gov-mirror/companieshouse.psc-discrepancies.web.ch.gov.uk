describe('routes/utils/defaultRouteUtil', () => {
  const Utility = require(`${serverRoot}/lib/Utility`);

  const { validationException, serviceException, genericServerException, exceptionWithNoStatus, responseMock, viewDataMock } = require(`${testRoot}/server/_fakes/mocks`);

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
    beforeEach(() => {
      stubExceptionLogger = sinon.stub(Utility, 'logException').returns(true);
    });

    it('should return the error stack of a validation exception thrown by a route', () => {
      viewDataMock.this_errors = validationException;
      expect(ModuleUnderTest.processException(validationException, viewDataMock, responseMock)).to.eql(undefined);
      expect(stubExceptionLogger).to.have.been.calledOnce;
      expect(stubExceptionLogger).to.have.been.calledWith(validationException);
    });
    it('should handle a service exception thrown by a route', () => {
      viewDataMock.this_errors = serviceException;
      expect(ModuleUnderTest.processException(serviceException, viewDataMock, responseMock)).to.eql(undefined);
      expect(stubExceptionLogger).to.have.been.calledOnce;
      expect(stubExceptionLogger).to.have.been.calledWith(serviceException);
    });
    it('should handle a generic server exception thrown by a route', () => {
      viewDataMock.this_errors = genericServerException;
      expect(ModuleUnderTest.processException(genericServerException, viewDataMock, responseMock)).to.eql(undefined);
      expect(stubExceptionLogger).to.have.been.calledOnce;
      expect(stubExceptionLogger).to.have.been.calledWith(genericServerException);
    });
    it('should gracefully handle an exception with no status field thrown by a route', () => {
      viewDataMock.this_errors = exceptionWithNoStatus;
      expect(ModuleUnderTest.processException(exceptionWithNoStatus, viewDataMock, responseMock)).to.eql(undefined);
      expect(stubExceptionLogger).to.have.been.calledOnce;
      expect(stubExceptionLogger).to.have.been.calledWith(exceptionWithNoStatus);
    });
  });
});
