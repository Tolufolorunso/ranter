exports.noResourceFound = (req, res) => {
  let errorCode = 404;
  res.status(errorCode);
  res.render(`${errorCode}`, { message: "The page does not exist!" });
};

exports.respondInternalError = (error, req, res, next) => {
  let errorCode = 500;
  console.log(`ERROR occurred: ${error.stack}`);
  console.log("tolulope", error);
  res.status(errorCode);

  res.render("500", {
    message: "Sorry, our application is experiencing a problem! tolulope",
  });

  //   res.send(`${errorCode} | Sorry, our application is
  // experiencing a problem!`);
};
