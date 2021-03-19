const Utility = require(`${serverRoot}/lib/Utility`);
const Redis = require('ioredis');
const { Session, SessionStore } = require('ch-node-session-handler');

class cacheservice {
  getCachedDataFromSession (session) {
    const cachedData = session.__value.getExtraData('pscCache');
    console.log('@@@ GETCACHEDDATAMETHOD NOTHING ', JSON.stringify(cachedData.isNothing()));
    return cachedData.isJust() ? cachedData : { appData: {}, accountData: {} };
  }

  setPscCache (session, dataToSave) {
    const sessionStore = this.getSessionStore();
    session.__value.saveExtraData('pscCache', dataToSave);
    console.log('@@@@@SESSION SETPSCCACHEEXTRADATA', JSON.stringify(this.getCachedDataFromSession(session)));
    return sessionStore.store(process.env.COOKIE_NAME, session).run().then(r => {
    }).catch(err => {
      Utility.logException(err);
    });
  }

  getSessionStore () {
    if (!this.sessionStore) {
      this.sessionStore = new SessionStore(new Redis(`redis://${process.env.CACHE_SERVER}`));
    }
    return this.sessionStore;
  }

  getNotifications (request) {
    const session = request.session;
    let notifications = [];
    if (session !== undefined) {
      notifications = this._getNotificationsFromSession(session);
      session.setExtraData('notification', []);
    }
    return notifications;
  }
}

module.exports = cacheservice;
