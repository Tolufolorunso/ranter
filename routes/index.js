var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.cookies.jwt) {
    return res.redirect("/ranter/newsfeed");
  }
  res.render("index", { title: "Express", message: req.flash("message") });
});
router.get("/re", function (req, res, next) {
  res.set("Content-Type", "text/plain");
  var s = "";
  for (var name in req.headers) s += name + ": " + req.headers[name] + "\n";
  res.send(s);
});

module.exports = router;
