const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../middlewares/appError");
const catchAsync = require("../middlewares/catchAsync");
const { promisify } = require("util");
const session = require("express-session");

exports.registerUser = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    res.redirect("/users/test");
  }
  const { password, passwordConfirm, name, email } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new Error("User is already exists", 400));
  }
  req.body.role = "user";
  const newUser = await User.create(req.body);
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  req.flash("success", "Registration is successful, please login");
  res.status(201).redirect("/users/login");
});

exports.loginUser = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    res.redirect("/users/test");
  }
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash("errorlogin", "All fields are required");
    return res.status(401).redirect("/users/login");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    req.flash("errorlogin", "Incorrect email or password");
    return res.status(401).redirect("/users/login");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  res.redirect("/users/test");
});

exports.authorize = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    req.flash("message", "Working now");
    return res.redirect("/");
    // return next(new AppError("You are not login, please log in", 401));
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(new AppError("The user doesnt exists", 401));
  }

  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError("User recently changed password! please log in again", 401)
    );
  }

  //Grant access to protected route
  req.user = currentUser;
  next();
});

exports.logoutUser = async (req, res, next) => {
  try {
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 3 * 1000),
      httpOnly: true,
    });
    // .redirect("/");
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.render("error");
  }
};

exports.getLoginForm = async (req, res, next) => {
  if (req.cookies.jwt) {
    return res.redirect("/users/test");
  }
  res.render("auths/loginform", {
    error: req.flash("errorlogin"),
    success: req.flash("success"),
  });
};

exports.authorizeFor = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have access to perform the operation!", 403)
      );
    }
    next();
  };
};

const user = {
  name: "Folorunso",
  email: "admin@yahoo.com",
  password: "123",
  passwordConfirm: "123",
  role: "admin",
};

// User.create(user, (error) => {
//   if (error) {
//     throw error;
//   }
// });
