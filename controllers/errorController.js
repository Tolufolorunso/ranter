const AppError = require('../utils/appError');
const { Mongoose } = require('mongoose');

exports.respondInternalError = (error, req, res, next) => {
	let err = { ...error };
	err.message = error.message;
	console.log(`ERROR occurred 1: ${error.stack}`);
	console.log('2', error.message);
	console.log('3', error.name);
	console.log('4', error.status);

	// Mongoose bad ObjectID
	if (error.name === 'CastError') {
		const message = `Resource not found with the user id`;
		err = new AppError(message, 404);
	}

	// Mongoose duplicate key
	if (error.code === 11000) {
		const message = `Duplicate field value entered`;
		err = new AppError(message, 400);
	}

	// Mongoose Validation Error
	if (error.name === 'ValidationError') {
		const message = Object.values(error.errors).map(val => val.message);
		console.log(message);
		err = new AppError(message, 400);
	}

	res.status(err.status).json({
		success: false,
		message: err.message || 'server error'
	});
};
