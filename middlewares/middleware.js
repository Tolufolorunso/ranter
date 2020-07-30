exports.appTime = (req, res, next) => {
  const now = new Date();
  req.time = {
    year: now.getFullYear(),
    today: now.toDateString(),
  };
  next();
};
