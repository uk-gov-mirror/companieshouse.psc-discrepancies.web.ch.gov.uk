describe('lib/Utility', () => {

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

});
