module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (error.statusCode === 404) {
    return res.status(404).render("404", {
      message: error.message,
    });
  } else if (error.statusCode === 500) {
    console.log(error);

    return res.status(500).render("500", {
      message: error.message,
    });
  }
};
