class cacheservice {
  getCachedDataFromSession (session) {
    const cachedData = session.getExtraData('pscCache');
    return typeof cachedData !== 'undefined' ? cachedData : { appData: {}, accountData: {} };
  }

  setPscCache (session, dataToSave) {
    return session.setExtraData('pscCache', dataToSave);
  }
}

module.exports = cacheservice;
