var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.cookies.jwt) {
    return res.redirect("/ranter/newsfeed");
  }
  res.render("index", { title: "Express", message: req.flash("message") });
});

// router.get("/500", function (req, res, next) {
//   res.render("500");
// });

module.exports = router;
