// @desc        GET message page.
// @route       GET /users/message
// @access      Private
exports.getMessagePage = (req, res, next) => {
	console.log(req.user);
	res.render('message', { title: 'message', message: req.flash('message') });
};
