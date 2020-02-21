const router = require('express').Router();

/*
 * GET handler for Index action
 */
router.get('/', (req, res, next) => {
	res.render('ctrlr-3/index', {
		title: 'GET handler for index action Controller 3',
		this_data: {sample_key:"sample value"}
	});
});

module.exports = router;
