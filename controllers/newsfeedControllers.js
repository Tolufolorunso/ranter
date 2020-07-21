const User = require("../models/userModel");
const AppError = require("../middlewares/appError");
const catchAsync = require("../middlewares/catchAsync");

exports.getNewsfeed = (req, res) => {
  res.render("./newsfeed/newsfeed");
};
exports.postRant = catchAsync(async (req, res) => {
  const post = await User.create(req.body, {});
  console.log(post);
});
