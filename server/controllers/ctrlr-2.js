const router = require('express').Router();

const SampleServiceOne = require('./../services/sample_service_one');
const ss1 = new SampleServiceOne();

/*
 * GET handler for Index action
 */
router.get('/', (req, res, next) => {
	res.render('ctrlr-2/index', {
		title: 'Index handler/action for Controller 2',
		this_data: {sample_key:"sample page data for GET on index page for this controller"}
	});
});

/*
 * GET handler for action-one
 */
router.get('/action-one', (req, res, next) => {
		res.render('ctrlr-2/action_one', {
			title: 'GET handler for "action-one" of Controller2',
			this_data: {sample_key:"sample page data for GET"}
		});
});

/*
 * POST handler for action-one
 */
router.post('/action-one', (req, res, next) => {
	res.render('ctrlr-2/action_one', {
		title: 'POST handler for "action-one" of Controller2',
		this_data: {sample_key:"sample page data after POST"}
	});
});

module.exports = router;
