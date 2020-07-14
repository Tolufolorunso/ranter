const authController = require("../contollers/authControllers");
const { authorize } = require("../middlewares/middleware");

const router = require("express").Router();

console.log(authorize);

router.get("/test", authorize, (req, res) => {
  res.send("text");
});

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

module.exports = router;
