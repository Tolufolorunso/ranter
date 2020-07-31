require('dotenv').config();

const express = require('express');
const sass = require('node-sass-middleware');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

const AppError = require('./utils/appError');
const { respondInternalError } = require('./controllers/errorController');

const indexRouter = require('./routes/index');
const generalRouter = require('./routes/general');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const newsfeedRouter = require('./routes/newsfeedRoute');

const app = express();

// Middlewares

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
	sass({
		src: __dirname + '/sass',
		dest: __dirname + '/public/stylesheets',
		// debug: true,
		outputStyle: 'compressed',
		prefix: '/stylesheets'
	})
);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(
//   session({
//     secret: "my secret",
//     saveUninitialized: true,
//     resave: false,
//   })
// );
const IN_PROD = process.env.NODE_ENV === 'production';
const SESSNAME = 'rant';
app.use(
	session({
		name: SESSNAME,
		resave: false,
		saveUninitialized: false,
		secret: process.env.SESSION_SECRET,
		cookie: {
			sameSite: true,
			secure: IN_PROD
		}
	})
);

app.use(flash());

app.use(helmet());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/', generalRouter);
app.use(authRouter);
app.use('/users', userRouter);
app.use('/ranter', newsfeedRouter);

mongoose
	.connect(process.env.DATABASE_LOCAL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(c => console.log('DATABASE connection successfull'))
	.catch(() => console.log('not connected to db'));

//Handling unhandle routes
// catch 404 and forward to error handler
app.all('*', (req, res, next) => {
	res.render('404', {
		status: 'fail',
		message: 'Page not found'
	});
});

// catch 500 and forward to error handler
app.use(respondInternalError);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log('serving on port 4000');
});
