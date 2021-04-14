const { Session } = require('@companieshouse/node-session-handler');
const CacheService = require(`${serverRoot}/services/cache_service`);
const cacheService = new CacheService();

describe('services/cache_service.js', () => {
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

  it('should return the extradata that has already been saved to request.session', () => {
    const mockSession = new Session();
    const mockExtraData = { appData: { psc: 'psc' }, accountData: {} };
    sinon.stub(Session.prototype, 'getExtraData').returns(mockExtraData);
    expect(cacheService.getCachedDataFromSession(mockSession)).to.eql(mockExtraData);
  });
  it('should return the newly created extra data since it didnt exist before', () => {
    const mockSession = new Session();
    const mockExtraData = { appData: {}, accountData: {} };
    const undefinedExtraData = undefined;
    sinon.stub(Session.prototype, 'getExtraData').returns(undefinedExtraData);
    expect(cacheService.getCachedDataFromSession(mockSession)).to.eql(mockExtraData);
  });

  it('should set the session data we want to save inside extra data', () => {
    const mockSession = new Session();
    mockSession.data.extra_data.pscCache = {};
    const mockDataToSet = {};
    sinon.stub(Session.prototype, 'setExtraData').returns(mockDataToSet);
    expect(cacheService.setPscCache(mockSession)).to.eql(mockDataToSet);
  });
});
