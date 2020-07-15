var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.cookies.jwt) {
    return res.redirect("/users/test");
  }
  res.render("index", { title: "Express", message: req.flash("message") });
});

module.exports = router;
