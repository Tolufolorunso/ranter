const Post = require("../models/postsModel");
const User = require("../models/userModel");
const AppError = require("../middlewares/appError");
const catchAsync = require("../middlewares/catchAsync");
const sharp = require("sharp");

exports.getUserProfile = catchAsync(async (req, res) => {
  const user = res.locals.user;
  console.log(user);
  if (!user) {
    req.flash("message", "Please login to view your profile");
    return res.render("index");
  }
  // const img = await User.findById(user._id);
  res.render("./users/profile", { user });
});

exports.updateUserProfile = catchAsync(async (req, res, next) => {
  // req.body.userId
  const user = await User.findByIdAndUpdate(
    "5f1de5deeb71de2bd8c523ba",
    req.body
  );
  if (!user) {
    return next(new Error("The user doesnt exists", 401));
  }

  console.log(user);

  res.status(200).json({
    status: "success",
    message: "Your profile updated successfully",
    data: {
      user: user,
    },
  });
  // const user = res.locals.user;
  // const img = await User.findById(user._id);
  // res.render("./users/profile", { user });
});

exports.updateAvatar = catchAsync(async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize(150, 200).png().toBuffer();

  await User.findByIdAndUpdate(req.user._id, {
    avatar: buffer,
  });

  const user = await User.findById(req.user._id);
  res.send(user);
});

exports.getAvatar = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.set("Content-Type", "image/png");
  res.send(user.avatar);
});

// exports.postRant = catchAsync(async (req, res) => {
//     req.body.author = res.locals.user._id;
//     res.status(201).redirect("/ranter/newsfeed");
// });
