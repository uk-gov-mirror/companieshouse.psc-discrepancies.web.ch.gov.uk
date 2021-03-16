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
  it('setDiscrepancyTypes should return the Person specific array when individual-person-with-significant-control is passed in', () => {
    const mockRes = {
      locals: {
        session: {
          appData: {
            selectedPscDetails: {
              kind: 'individual-person-with-significant-control'
            }
          }
        }
      }
    };
    const expectedList = ['Name', 'Date of birth', 'Nationality',
      'Place of residence', 'Correspondence address', 'Notified date',
      'Nature of control', 'Other reason'];
    expect(ModuleUnderTest.setDiscrepancyTypes(mockRes)).to.eql(expectedList);
  });

  it('setDiscrepancyTypes should return the ORP specific array when legal-person-person-with-significant-control is passed in', () => {
    const mockRes = {
      locals: {
        session: {
          appData: {
            selectedPscDetails: {
              kind: 'legal-person-person-with-significant-control'
            }
          }
        }
      }
    };
    const expectedList = ['Name', 'Governing law', 'Legal form',
      'Correspondence address', 'Notified date', 'Nature of control',
      'Other reason'];
    expect(ModuleUnderTest.setDiscrepancyTypes(mockRes)).to.eql(expectedList);
  });

  it('setDiscrepancyTypes should return the RLE specific array when corporate-entity-person-with-significant-control is passed in', () => {
    const mockRes = {
      locals: {
        session: {
          appData: {
            selectedPscDetails: {
              kind: 'corporate-entity-person-with-significant-control'
            }
          }
        }
      }
    };
    const expectedList = ['Company Name', 'Company Number',
      'Place of Registration', 'Incorporation law', 'Governing law',
      'Legal form', 'Correspondence address', 'Notified date',
      'Nature of control', 'Other reason'];
    expect(ModuleUnderTest.setDiscrepancyTypes(mockRes)).to.eql(expectedList);
  });

  it('setDiscrepancyTypes should return the Other reason value should an invalid kind is in slectedPscdetails', () => {
    const mockRes = {
      locals: {
        session: {
          appData: {
            selectedPscDetails: {
              kind: 'not-real-person-with-significant-control'
            }
          }
        }
      }
    };
    const expectedList = ['Other reason'];
    expect(ModuleUnderTest.setDiscrepancyTypes(mockRes)).to.eql(expectedList);
  });

  it('setDiscrepancyTypes should return null when a the kind cannot be retrieved from the session so that the null can be handled by the route', () => {
    const errorRes = {};
    const expectedList = null;
    expect(ModuleUnderTest.setDiscrepancyTypes(errorRes)).to.eql(expectedList);
  });

  it('setPageTitle should return the given page name concatenated with the service name and GOV.UK ', () => {
    const expectedTitle = 'Report a discrepancy - PSC discrepancies - GOV.UK';
    expect(ModuleUnderTest.setPageTitle('Report a discrepancy')).to.eql(expectedTitle);
  });
});
