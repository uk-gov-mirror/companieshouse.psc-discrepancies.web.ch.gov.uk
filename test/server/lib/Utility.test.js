describe('lib/Utility', () => {

  const logger = require(`${serverRoot}/config/winston`);
  const { genericServerException } = require(`${testRoot}/server/_fakes/mocks`);

  let ModuleUnderTest = require(`${serverRoot}/lib/Utility`);

  beforeEach(() => {
    sinon.reset();
    sinon.restore();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  describe('Get randomString', () => {
    it('should return a random alphanumeric string', () => {
      expect(ModuleUnderTest.getRandomString(5, 8)).to.have.lengthOf.within(5, 8);
    });
  });
  describe('Log exception', () => {
    it('should correctly log an exception', () => {
      let stubLogger =  sinon.stub(logger, 'error').returns(true);
      expect(ModuleUnderTest.logException(genericServerException)).to.be.undefined;
      expect(stubLogger).to.have.been.calledOnce;
    });
  });

});
