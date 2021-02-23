const Utility = require(`${serverRoot}/lib/Utility`);

const authentication = (req, res, next) => {
  try {
    let authCheck = false;
    if (typeof req.session !== 'undefined') {
      if (typeof req.session.__value !== 'undefined') {
        if (typeof req.session.__value.data !== 'undefined') {
          if (typeof req.session.__value.data.signin_info !== 'undefined') {
            if (req.session.__value.data.signin_info.signed_in === 1) {
              authCheck = true;
            }
          }
        }
      }
    }

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
