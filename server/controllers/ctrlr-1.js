const router = require('express').Router();

/*
 * GET handler for Index action
 */
router.get('/', (req, res, next) => {
	res.render('ctrlr-1/index', {
		title: 'Index handler/action for Controller 1',
		this_data: {sample_key:"sample value"}
	});
});

/*
 * GET handler for action-one
 */
router.get('/action-one', (req, res, next) => {
		res.render('ctrlr-1/action_one', {
		title: 'GET handler for "action-one" of Controller 1',
		this_data: {sample_key:"sample value for GET"}
	});
});


module.exports = router;
