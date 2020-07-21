const authController = require("../controllers/authControllers");

// const { authorize } = require("../middlewares/middleware");

const router = require("express").Router();

router.post("/register", authController.registerUser);
router.get("/login", authController.getLoginForm);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);

module.exports = router;
