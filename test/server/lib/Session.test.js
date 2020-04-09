describe('lib/Session', () => {

  const { Session, SessionStore } = require('ch-node-session-handler');
  const Utility = require(`${serverRoot}/lib/Utility`);
  const ModuleUnderTest = require(`${serverRoot}/lib/Session`);
  const { responseMock, requestMockWithSessionCookie, requestMockWithoutSessionCookie,
          sessionStoreLoadResolves, sessionStoreLoadRejects, sessionStoreWriteResolves,
          sessionStoreWriteRejects } = require(`${testRoot}/server/_fakes/mocks/lib/session`);

  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    sinon.stub(Utility, 'logException').returns(undefined);
    done();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  describe('Write a value to the Session', () => {

    it('should update session data using an existing session Id', () => {
      let moduleUnderTest = new ModuleUnderTest(requestMockWithSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      let stubSessionStoreLoad = sinon.stub(moduleUnderTest.sessionStore, 'load').returns(sessionStoreLoadResolves);
      let stubSessionStoreSave = sinon.stub(moduleUnderTest.sessionStore, 'store').returns(sessionStoreWriteResolves);
      expect(moduleUnderTest.write({ sample: "value" })).to.eventually.eql(true);
      expect(stubSessionStoreLoad).to.have.been.calledOnce;
      expect(stubSessionStoreLoad).to.have.been.calledWith(moduleUnderTest.cookie);
    });

    it('should update cached session data using a newly created session Id', () => {
      let moduleUnderTest = new ModuleUnderTest(requestMockWithoutSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      let stubSessionStoreLoad = sinon.stub(moduleUnderTest.sessionStore, 'load').returns(sessionStoreLoadResolves);
      let stubSessionStoreSave = sinon.stub(moduleUnderTest.sessionStore, 'store').returns(sessionStoreWriteResolves);
      expect(moduleUnderTest.write({ sample: "value" })).to.eventually.eql(true);
      expect(stubSessionStoreLoad).to.have.been.calledOnce;
      expect(stubSessionStoreLoad).to.have.been.calledWith(moduleUnderTest.cookie);
    });

    it.skip('should fail to update cached session data using an existing session Id', () => {
      let moduleUnderTest = new ModuleUnderTest(requestMockWithSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      let stubSessionStoreLoad = sinon.stub(moduleUnderTest.sessionStore, 'load').returns(Promise.reject(false));
      expect(moduleUnderTest.write({ sample: "value" })).to.be.rejectedWith(false);
      expect(stubSessionStoreLoad).to.have.been.calledOnce;
      expect(stubSessionStoreLoad).to.have.been.calledWith(moduleUnderTest.cookie);
    });

    it('should fail to update cached session data using an existing session Id having successfully called load', () => {
      let moduleUnderTest = new ModuleUnderTest(requestMockWithSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      let stubSessionStoreLoadRunRejects = sinon.stub(moduleUnderTest.sessionStore, 'load').returns(sessionStoreLoadRejects);
      expect(moduleUnderTest.write({ sample: "value" })).to.be.rejectedWith(false);
      expect(stubSessionStoreLoadRunRejects).to.have.been.calledOnce;
      expect(stubSessionStoreLoadRunRejects).to.have.been.calledWith(moduleUnderTest.cookie);
    });
  });

  describe('Read a value from the Session', () => {

    it.skip('should read in cached session data using an existing session Id', () => {
      let moduleUnderTest = new ModuleUnderTest(requestMockWithSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      let stubSessionStoreLoad = sinon.stub(moduleUnderTest.sessionStore, 'load').returns(sessionStoreLoadResolves);
      expect(moduleUnderTest.read()).to.eventually.eql({});
      expect(stubSessionStoreLoad).to.have.been.calledOnce;
      expect(stubSessionStoreLoad).to.have.been.calledWith(moduleUnderTest.cookie);
    });

    it.skip('should fail to read in cached session data using an existing Id', () => {
      let moduleUnderTest = new ModuleUnderTest(requestMockWithSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      let stubSessionStoreLoad = sinon.stub(moduleUnderTest.sessionStore, 'load').rejects(false).returns(false);
      expect(moduleUnderTest.read()).to.be.rejectedWith(false);
      expect(stubSessionStoreLoad).to.have.been.calledOnce;
      expect(stubSessionStoreLoad).to.have.been.calledWith(moduleUnderTest.cookie);
    });

    it('should return a SessionStore object', () => {
      let moduleUnderTest = new ModuleUnderTest(requestMockWithSessionCookie, responseMock);
      moduleUnderTest.sessionStore = new SessionStore();
      expect(moduleUnderTest.getSessionStore()).to.be.eql(moduleUnderTest.sessionStore);
    });

  });

});
