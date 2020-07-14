const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.appTime = (req, res, next) => {
  const now = new Date();
  req.time = {
    year: now.getFullYear(),
    today: now.toDateString(),
  };
  next();
};

exports.globalError = (error, req, res, next) => {
  if (error) {
    res.status(422).render("error", {
      title: "Error page",
      time: req.time,
      error: error.message,
      isAuthenticated: req.session.isLoggedIn,
    });
  }
};

exports.authorize = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new Error("You are not login, please log in", 401));
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(new Error("The user doesnt exists", 401));
  }

  // if (currentUser.changedPasswordAfter(decodedToken.iat)) {
  //   return next(
  //     new Error("User recently changed password! please log in again", 401)
  //   );
  // }
  req.user = currentUser;
  next();
};
