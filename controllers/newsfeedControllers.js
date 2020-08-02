const Post = require('../models/postsModel');
const AppError = require('../utils/appError');
const catchAsync = require('../middlewares/catchAsync');

// @desc        Get get newsfeed
// @route       GET /ranter/newsfeed
// @access      Private
exports.getNewsfeed = catchAsync(async (req, res) => {
	const posts = await Post.find();
	res
		.status(200)
		.render('./newsfeed/newsfeed', { posts, title: 'Newsfeed Page' });
});

// @desc        Get get newsfeed
// @route       POST /ranter/newsfeed
// @access      Private
exports.postRant = catchAsync(async (req, res) => {
	req.body.author = res.locals.user._id;

	req.body.images = req.file.filename;
	const post = await Post.create(req.body);

	res.status(201).redirect('/ranter/newsfeed');
});
