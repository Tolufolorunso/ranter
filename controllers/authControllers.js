const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../middlewares/appError');
const catchAsync = require('../middlewares/catchAsync');
const { promisify } = require('util');
const session = require('express-session');
const { validationResult } = require('express-validator');

exports.getRegisterForm = async (req, res, next) => {
	if (req.cookies.jwt) {
		return res.redirect('/ranter/newsfeed');
	}
	res.render('auths/registerform', {
		message: 'tolulope',
		errorsValidation: []
	});
};

exports.registerUser = catchAsync(
	async (req, res, next) => {
		if (req.cookies.jwt) {
			res.redirect('/ranter/newsfeed');
		}

		const { email, gender } = req.body;
		// const userExist = await User.findOne({ email });
		// if (userExist) {
		//   return next(new AppError("User is already exists", 400));
		// }
		req.body.role = 'user';
		console.log(req.body);

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).render('auths/registerform', {
				errorMessage: errors.array()[0].msg,
				errorsValidation: errors.array(),
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				gender: req.body.password,
				zip: req.body.zip
			});
		}

		const newUser = await User.create(req.body);
		// const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
		//   expiresIn: process.env.JWT_EXPIRES_IN,
		// });
		req.flash(
			'success',
			'Registration is successful, please login'
		);
		res.status(201).redirect('/login');
	}
);

exports.getLoginForm = async (req, res, next) => {
	if (req.cookies.jwt) {
		return res.redirect('/ranter/newsfeed');
	}
	res.render('auths/loginform', {
		error: req.flash('errorlogin'),
		success: req.flash('success'),
		errorMessage: ''
	});
};

exports.loginUser = catchAsync(async (req, res, next) => {
	if (req.cookies.jwt) {
		res.redirect('/ranter/newsfeed');
	}
	const { email, password } = req.body;
	// const errors = validationResult(req);
	// if (!error.isEmpty()) {
	//   return res.status(422).render("auths/registerform", {
	//     errorMessage: errors.array()[0].msg,
	//   });
	// }

	if (!email || !password) {
		return res.status(401).json({
			status: 'fail',
			message: 'All fields are required'
		});
	}

	const user = await User.findOne({ email }).select(
		'+password'
	);

	if (
		!user ||
		!(await user.correctPassword(password, user.password))
	) {
		return res.status(401).json({
			status: 'fail',
			message: 'Incorrect email or password'
		});
	}

	const token = jwt.sign(
		{ id: user._id },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRES_IN
		}
	);

	const cookieOptions = {
		expires: new Date(
			Date.now() +
				process.env.JWT_COOKIE_EXPIRES_IN *
					24 *
					60 *
					60 *
					1000
		),
		httpOnly: true
	};

	if (process.env.NODE_ENV === 'production')
		cookieOptions.secure = true;
	res.cookie('jwt', token, cookieOptions);
	res.status(200).json({
		status: 'success',
		user,
		token
	});
	// res.redirect("/ranter/newsfeed");
});

exports.authorize = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		req.flash(
			'message',
			'You are not loggedin, please log in'
		);
		return res.redirect('/');
	}

	const decodedToken = await promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET
	);

	const currentUser = await User.findById(decodedToken.id);
	if (!currentUser) {
		return next(
			new AppError('The user doesnt exists', 401)
		);
	}

	if (currentUser.changedPasswordAfter(decodedToken.iat)) {
		return next(
			new AppError(
				'User recently changed password! please log in again',
				401
			)
		);
	}

	//Grant access to protected route
	req.user = currentUser;
	next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
	if (req.cookies.jwt) {
		token = req.cookies.jwt;

		const decodedToken = await promisify(jwt.verify)(
			req.cookies.jwt,
			process.env.JWT_SECRET
		);

		const currentUser = await User.findById(
			decodedToken.id
		);
		if (!currentUser) {
			return next();
		}

		if (
			currentUser.changedPasswordAfter(decodedToken.iat)
		) {
			return next();
		}
		//Grant access to protected route
		res.locals.user = currentUser;
		return next();
	}
	next();
});

exports.logoutUser = async (req, res, next) => {
	try {
		await res.cookie('rant', '', { expires: new Date() });

		await res.cookie('jwt', 'loggedout', {
			expires: new Date(),
			httpOnly: true
		});
		return res.status(200).json({ status: 'success' });
	} catch (error) {
		return res.render('error');
	}
};

exports.authorizeFor = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError(
					'You do not have access to perform the operation!',
					403
				)
			);
		}
		next();
	};
};

const user = {
	name: 'Folorunso',
	email: 'admin@yahoo.com',
	password: '123',
	passwordConfirm: '123',
	role: 'admin'
};

// User.create(user, (error) => {
//   if (error) {
//     throw error;
//   }
// });
