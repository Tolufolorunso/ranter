var express = require('express');
var router = express.Router();

/* GET home page. */
// @desc        GET home page.
// @route       GET /
// @access      Public
router.get('/', function (req, res, next) {
	if (req.cookies.jwt) {
		return res.redirect('/ranter/newsfeed');
	}
	res.render('index', { title: 'Express', message: req.flash('message') });
});

module.exports = router;
