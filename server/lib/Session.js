/*
 * Session wrapper around the CH Session Handler
 */
const Redis = require('ioredis');
const { Session, SessionStore } = require('ch-node-session-handler');
const uuid = require('uuid/v4');

class AppSession {
  constructor (req, res) {
    this.req = req;
    this.res = res;
    this._setUp();
  }

  _setUp () {
    const appName = 'PSC-D';
    if (typeof this.req.cookie.PSC_SID !== 'undefined') {
      this.sessionId = `${appName}-${this.req.cookie.PSC_SID}}`;
    } else {
      this.sessionId = `${appName}-${uuid()}`;
      // Remember to switch to __SID cookie once the service is behind Login
      this.res.cookie('PSC_SID', this.sessionId, { httpOnly: true, domain: `${process.env.WEB_DOMAIN}`, path: '/' });
    }
    this.cookie = { sessionId: this.sessionId, signature: `${process.env.COOKIE_SECRET}` };
    this.sessionStore = new SessionStore(new Redis(`redis://${process.env.CACHE_SERVER}`));
  }

  /**
   * Write to the session object
   * @param {object} value - the value to save against the App session key
   * @return {Promise<any, any>}
   */
  write (value) {
    return new Promise((resolve, reject) => {
      try {
        this.sessionStore.load(this.cookie).run()
          .then(data => {
            const session = new Session(data.extract());
            session.saveExtraData(this.sessionId, value);
            this.sessionStore.store(this.cookie, session.data).run()
              .then(_ => {
                resolve(true);
              }).catch(err => {
                reject(err);
              });
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Read in our session data
   * @param {string} key - session Key/ID for the app
   * @return {Promise<any, any>}
   */
  read (key) {
    return new Promise((resolve, reject) => {
      try {
        this.sessionStore.load(this.cookie).run()
          .then(data => {
            const session = new Session(data.extract());
            return resolve(session.getExtraData(this.sessionId));
          }).catch(err => {
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}
module.exports = AppSession;
