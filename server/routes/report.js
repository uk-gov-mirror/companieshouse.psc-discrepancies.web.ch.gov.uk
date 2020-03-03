const router = require('express').Router();
const routeViews = 'report';

router.get('(/report-a-discrepancy)?', (req, res, next) => {
	res.render(`${routeViews}/index.njk`);
});

router.get('/report-a-discrepancy/obliged-entity/email', (req, res, next) => {
	res.render(`${routeViews}/index.njk`);
});

router.get('/report-a-discrepancy/confirmation', (req, res) => {
	res.render(`${routeViews}/confirmation.njk`);
});

module.exports = router;
