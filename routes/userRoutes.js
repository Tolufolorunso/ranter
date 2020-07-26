const express = require("express");
const userControllers = require("../controllers/userControllers");
const router = express.Router();
const authController = require("../controllers/authControllers");

const multer = require("multer");
router.use(authController.isLoggedIn);
router.use(authController.authorize);

/* GET users listing. */
router.get("/profile", userControllers.getUserProfile);
router.get("/:id/avatar", userControllers.getAvatar);

//Upload profile avatar

const upload = multer({
  limits: {
    fileSize: 1000000,
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

const multerError = (error, req, res, next) => {
  res.status(400).json({
    status: "fail",
    message: error.message,
  });
};

router.patch(
  "/me/avatar",
  authController.authorize,
  upload.single("avatar"),
  userControllers.updateAvatar,
  multerError
);

module.exports = router;
