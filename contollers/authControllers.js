const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../middlewares/appError");

exports.registerUser = async (req, res, next) => {
  try {
    const { password, passwordConfirm, name, email } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(new Error("User is already exists", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    req.body.password = hashedpassword;

    const newUser = await User.create(req.body);

    res.status(201).json(newUser);
  } catch (error) {
    res.render("error");
  }
};

exports.loginUser = async (req, res, next) => {
  console.log("go");
  try {
    const { password, email } = req.body;

    if (!email || !password) {
      return next(new AppError("Please enter email and password", 400));
    }

    // checking if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Email does  not exist", 400));
    }

    console.log(user);

    // checking if password correct
    const validPass = await bcrypt.compare(password, user.password);
    console.log(validPass);
    if (!validPass) {
      //   return next(new Error());
      return next(new AppError("password does  not exist", 400));
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.header("auth-token", token).send(token);

    // res.status(200).json(user);
  } catch (error) {
    res.render("error");
  }
};
