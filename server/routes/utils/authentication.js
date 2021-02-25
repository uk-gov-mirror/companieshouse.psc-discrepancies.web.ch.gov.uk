const Utility = require(`${serverRoot}/lib/Utility`);
const { SessionKey } = require('ch-node-session-handler/lib/session/keys/SessionKey');
const { SignInInfoKeys } = require('ch-node-session-handler/lib/session/keys/SignInInfoKeys');

const authentication = (req, res, next) => {
  try {
    const authCheck = (req.session && req.session.__value && req.session.__value.data && req.session.__value.data[SessionKey.SignInInfo])
      ? req.session.__value.data[SessionKey.SignInInfo][SignInInfoKeys.SignedIn] === 1
      : false;

    if (process.env.PUBLIC_PAGES.includes(req.url)) {
      next();
    } else if (authCheck) {
      next();
    } else {
      Utility.logException('Unauthenticated user attempting to access non public path');
      return res.redirect(302, `/signin?return_to=${req.url}`);
    }
  } catch (err) {
    Utility.logException(err);
    next(err);
  }
};

module.exports = authentication;
