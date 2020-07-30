const authController = require('../controllers/authControllers');
const User = require('../models/userModel');

const { body, check } = require('express-validator');

// const { regValidation } = require("../middlewares/validation");

const router = require('express').Router();

router.use(authController.isLoggedIn);

router.post(
	'/register',
	[
		check('email')
			.isEmail()
			.withMessage('please enter a valid email.')
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then(user => {
					if (user) {
						return Promise.reject('Email already in use');
					}
				});
			}),
		body('name').isLength({ min: 4 }),
		body('zip', 'Invalid Zip code')
			.isLength({ min: 3 })
			.isNumeric(),
		body(
			'password',
			'Please enter a password with only number and text and at least 3 characters.'
		)
			.isLength({ min: 3 })
			.isAlphanumeric(),
		body('passwordConfirm').custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords have to match');
			}
			return true;
		})
	],
	authController.registerUser
);
router.get('/register', authController.getRegisterForm);
router.get('/login', authController.getLoginForm);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;
