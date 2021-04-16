class CacheService {
  getCachedDataFromSession (session) {
    const cachedData = (session) ? session.getExtraData('pscCache') : undefined;
    return typeof cachedData !== 'undefined' ? cachedData : { appData: {}, accountData: {} };
  }

  setPscCache (session, dataToSave) {
    return session.setExtraData('pscCache', dataToSave);
  }
}

module.exports = CacheService;
