const router = require('express').Router();

router.get('/', (req, res, next) => {
	res.render('route-2/index', {
		title: 'Index handler/action for "route-2"',
		this_data: {sample_key:"sample template data for index handler"}
	});
});

router.get('/handler-1', (req, res, next) => {
		res.render('route-2/handler_1', {
		title: 'GET handler for "handler-1" of "route-2"',
		this_data: {sample_key:"sample template data: handler-1"}
	});
});

router.get('/handler-2', (req, res, next) => {
		res.render('route-2/handler_2', {
		title: 'GET handler for "handler-2" of "route-2"',
		this_data: {sample_key:"sample template data: handler-2"}
	});
});

router.get('/handler-3', (req, res, next) => {
		res.render('route-2/handler_3', {
		title: 'GET handler for "handler-3" of "route-2"',
		this_data: {sample_key:"sample template data: handler-3"}
	});
});

module.exports = router;
