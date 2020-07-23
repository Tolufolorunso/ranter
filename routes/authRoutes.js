const authController = require("../controllers/authControllers");

// const { authorize } = require("../middlewares/middleware");

const router = require("express").Router();

router.use(authController.isLoggedIn);

router.post("/register", authController.registerUser);
router.get("/login", authController.getLoginForm);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logoutUser);

module.exports = router;
