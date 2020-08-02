const Post = require('../models/postsModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../middlewares/catchAsync');
const sharp = require('sharp');

// @desc        Get user profile
// @route       GET /users/profile
// @access      Private
exports.getUserProfile = catchAsync(async (req, res) => {
	const user = res.locals.user;
	if (!user) {
		req.flash('message', 'Please login to view your profile');
		return res.render('index');
	}
	res.render('./users/profile', { user, title: 'Profile' });
});

// @desc        Update user profile
// @route       PATCH /users/me/profile
// @access      Private
exports.updateUserProfile = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.user._id, req.body);
	if (!user) {
		return next(new AppError('The user doesnt exists', 404));
	}

	res.status(200).json({
		status: 'success',
		message: 'Your profile updated successfully',
		data: {
			user: user
		}
	});
});

// @desc        Update user profile avatar
// @route       PATCH /users/me/avatar
// @access      Private
exports.updateAvatar = catchAsync(async (req, res) => {
	const buffer = await sharp(req.file.buffer).resize(150, 200).png().toBuffer();

	await User.findByIdAndUpdate(req.user._id, {
		avatar: buffer
	});

	const user = await User.findById(req.user._id);
	res.send(user);
});

// @desc        Update user profile avatar
// @route       GET users/:Id/avatar
// @access      Private
exports.getAvatar = catchAsync(async (req, res) => {
	const user = await User.findById(req.params.id);
	res.set('Content-Type', 'image/png');
	res.send(user.avatar);
});

// exports.postRant = catchAsync(async (req, res) => {
//     req.body.author = res.locals.user._id;
//     res.status(201).redirect("/ranter/newsfeed");
// });
