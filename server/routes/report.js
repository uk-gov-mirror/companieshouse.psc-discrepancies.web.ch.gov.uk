const router = require('express').Router();
const routeViews = 'report';
const Validator = require(`${serverRoot}/lib/validation`);
const session = require('ch-node-session-handler');
const Redis = require("ioredis");
const { Session, SessionStore }  = require('ch-node-session-handler');

const validator = new Validator();
const cookie = {sessionId: '__SID-value-from-browser', signature: `${process.env.COOKIE_SECRET}`};

router.get('/report-a-discrepancy/session-test-1', (req, res, next) => {
  const sessionStore = new SessionStore(new Redis(`redis://${process.env.CACHE_SERVER}`));
  sessionStore.load(cookie).run()
    .then(data => {
      const session = new Session(data.extract());
      session.saveExtraData('xyz987', 'xyz987Value');
      console.log('1st sess');
      console.log(session);
      
      sessionStore.store(cookie, session.data).run()
        .then(d => {
          res.set('Content-Type', 'application/json');
          return res.status(200).json(session);
        });
    });
});

router.get('/report-a-discrepancy/session-test-2', (req, res, next) => {
  const sessionStore = new SessionStore(new Redis(`redis://${process.env.CACHE_SERVER}`));
  sessionStore.load(cookie).run()
  .then(data => {
    const session = new Session(data.extract());
    res.set('Content-Type', 'application/json');
    let abc = session.getExtraData('xyz987');
    res.status(200).json({
      extra: abc,
      session: session
    });
  });
});

router.get('(/report-a-discrepancy)?', (req, res, next) => {
  res.render(`${routeViews}/index.njk`);
});

router.get('/report-a-discrepancy/obliged-entity/email', (req, res, next) => {
  res.render(`${routeViews}/oe_email.njk`);
});

router.post('/report-a-discrepancy/obliged-entity/email', (req, res, next) => {
  validator.isValidEmail(req.body.email)
    .then(_ => {
      res.redirect(302, '/report-a-discrepancy/company-number');
    }).catch(err => {
      res.render(`${routeViews}/oe_email.njk`, {
        this_errors: err,
        this_data: req.body
      });
    });
});

router.get('/report-a-discrepancy/company-number', (req, res) => {
  res.render(`${routeViews}/company_number.njk`);
});

router.post('/report-a-discrepancy/company-number', (req, res) => {
  validator.isCompanyNumberFormatted(req.body.number)
    .then(_ => {
      res.redirect(302, '/report-a-discrepancy/discrepancy-details');
    }).catch(err => {
      res.render(`${routeViews}/company_number.njk`, {
        this_errors: err,
        this_data: req.body
      });
    });
});

router.get('/report-a-discrepancy/discrepancy-details', (req, res) => {
  res.render(`${routeViews}/discrepancy_details.njk`);
});

router.post('/report-a-discrepancy/discrepancy-details', (req, res, next) => {
  validator.isTextareaNotEmpty(req.body.details)
    .then(_ => {
      res.redirect(302, '/report-a-discrepancy/confirmation');
    }).catch(err => {
      res.render(`${routeViews}/discrepancy_details.njk`, {
        this_errors: err,
        this_data: req.body
      });
    });
});

router.get('/report-a-discrepancy/confirmation', (req, res) => {
  res.render(`${routeViews}/confirmation.njk`);
});

module.exports = router;
