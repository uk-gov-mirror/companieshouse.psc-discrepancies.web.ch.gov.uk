const Utility = require(`${serverRoot}/lib/Utility`);
const { SessionKey } = require('@companieshouse/node-session-handler/lib/session/keys/SessionKey');
const { SignInInfoKeys } = require('@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys');

const authentication = (req, res, next) => {
  try {
    const authCheck = (req.session && req.session && req.session.data && req.session.data[SessionKey.SignInInfo])
      ? req.session.data[SessionKey.SignInInfo][SignInInfoKeys.SignedIn] === 1
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
