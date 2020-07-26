const Post = require("../models/postsModel");
const AppError = require("../middlewares/appError");
const catchAsync = require("../middlewares/catchAsync");

exports.getNewsfeed = catchAsync(async (req, res) => {
  const posts = await Post.find();
  res.status(200).render("./newsfeed/newsfeed", { posts });
});

exports.postRant = catchAsync(async (req, res) => {
  req.body.author = res.locals.user._id;

  req.body.images = req.file.filename;
  const post = await Post.create(req.body);

  res.status(201).redirect("/ranter/newsfeed");
});
