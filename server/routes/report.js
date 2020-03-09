// eslint-disable-next-line new-cap
const router = require('express').Router();
const routeViews = 'report';

router.get('(/report-a-discrepancy)?', (req, res, next) => {
	res.render(`${routeViews}/index.njk`);
});

router.get('/report-a-discrepancy/obliged-entity/email', (req, res, next) => {
	res.render(`${routeViews}/oe_email.njk`);
});

router.get('/report-a-discrepancy/confirmation', (req, res) => {
	res.render(`${routeViews}/confirmation.njk`);
});

router.get('/report-a-discrepancy/discrepancy-details', (req, res) => {
	res.render(`${routeViews}/discrepancy_details.njk`);
});

module.exports = router;
