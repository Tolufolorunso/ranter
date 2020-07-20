const newsfeedController = require("../controllers/newsfeedControllers");
const auth = require("../controllers/authControllers");

const router = require("express").Router();

router.get("/newsfeed", newsfeedController.getNewsfeed);
router.post("/newsfeed", newsfeedController.postRant);

module.exports = router;
