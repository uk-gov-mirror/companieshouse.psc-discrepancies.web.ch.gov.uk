const { SessionStore } = require('ch-node-session-handler');
const Utility = require(`${serverRoot}/lib/Utility`);
const logger = require(`${serverRoot}/config/winston`);
const ModuleUnderTest = require(`${serverRoot}/lib/Session`);

describe('lib/Session', () => {
  const {
    responseMock, requestMockWithSessionCookie, requestMockWithoutSessionCookie,
    sessionStoreLoadResolves, sessionStoreLoadResolvesRead, sessionStoreLoadRejects,
    sessionStoreWriteResolves, sessionStoreWriteRejects
  } = require(`${testRoot}/server/_fakes/mocks/lib/session`);

  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    sinon.stub(Utility, 'logException').returns(undefined);
    stubLogger = sinon.stub(logger, 'info').returns(true);
    done();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  describe('write a value to the Session', () => {
    it('should update session data using an existing session Id', () => {
      const moduleUnderTest = new ModuleUnderTest(requestMockWithSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      const stubSessionStoreLoad = sinon.stub(moduleUnderTest.sessionStore, 'load').returns(sessionStoreLoadResolves);
      sinon.stub(moduleUnderTest.sessionStore, 'store').returns(sessionStoreWriteResolves);
      expect(moduleUnderTest.write({ sample: 'value' })).to.eventually.eql(true);
      expect(stubSessionStoreLoad).to.have.been.calledOnce;
      expect(stubSessionStoreLoad).to.have.been.calledWith(moduleUnderTest.cookie);
    });

    it('should update cached session data using a newly created session Id', () => {
      const moduleUnderTest = new ModuleUnderTest(requestMockWithoutSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      const stubSessionStoreLoad = sinon.stub(moduleUnderTest.sessionStore, 'load').returns(sessionStoreLoadResolves);
      sinon.stub(moduleUnderTest.sessionStore, 'store').returns(sessionStoreWriteResolves);
      expect(moduleUnderTest.write({ sample: 'value' })).to.eventually.eql(true);
      expect(stubSessionStoreLoad).to.have.been.calledOnce;
      expect(stubSessionStoreLoad).to.have.been.calledWith(moduleUnderTest.cookie);
    });

    it('should fail to update cached session data using an existing session Id', () => {
      const moduleUnderTest = new ModuleUnderTest(requestMockWithSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      const stubSessionStoreLoad = sinon.stub(moduleUnderTest, 'getSessionStore').returns(sessionStoreWriteRejects);
      expect(moduleUnderTest.write({ sample: 'value' })).to.be.rejectedWith(false);
      expect(stubSessionStoreLoad).to.have.been.calledOnce;
    });

    it('should fail to update cached session data using an existing session Id having successfully called load', () => {
      const moduleUnderTest = new ModuleUnderTest(requestMockWithSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      const stubSessionStoreLoadRunRejects = sinon.stub(moduleUnderTest.sessionStore, 'load').returns(sessionStoreLoadRejects);
      expect(moduleUnderTest.write({ sample: 'value' })).to.be.rejectedWith(false);
      expect(stubSessionStoreLoadRunRejects).to.have.been.calledOnce;
      expect(stubSessionStoreLoadRunRejects).to.have.been.calledWith(moduleUnderTest.cookie);
    });
  });

  describe('read a value from the Session', () => {
    it('should read in cached session data using an existing session Id', () => {
      const moduleUnderTest = new ModuleUnderTest(requestMockWithSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      const stubSessionStoreLoad = sinon.stub(moduleUnderTest, 'getSessionStore').returns(sessionStoreLoadResolvesRead);
      expect(moduleUnderTest.read()).to.eventually.eql({ id: 'abc123', appData: {}, accountData: {} });
      expect(stubSessionStoreLoad).to.have.been.calledOnce;
    });

    it('should fail to read in cached session data using an existing Id', () => {
      const moduleUnderTest = new ModuleUnderTest(requestMockWithSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      const stubSessionStoreLoad = sinon.stub(moduleUnderTest.sessionStore, 'load').rejects(false).returns(false);
      expect(moduleUnderTest.read()).to.be.rejectedWith(false);
      expect(stubSessionStoreLoad).to.have.been.calledOnce;
      expect(stubSessionStoreLoad).to.have.been.calledWith(moduleUnderTest.cookie);
    });

    it('should return a SessionStore object', () => {
      const moduleUnderTest = new ModuleUnderTest(requestMockWithSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      expect(moduleUnderTest.getSessionStore()).to.be.eql(moduleUnderTest.sessionStore);
    });
  });
});
