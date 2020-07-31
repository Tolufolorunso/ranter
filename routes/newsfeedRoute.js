const newsfeedController = require('../controllers/newsfeedControllers');
const auth = require('../controllers/authControllers');
const multer = require('multer');
const router = require('express').Router();
const AppError = require('../utils/appError');
const path = require('path');
const crypto = require('crypto');

router.use(auth.isLoggedIn);
router.use(auth.authorize);

const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: (req, file, cb) => {
		// let customFileName = crypto.randomBytes(18).toString("hex");
		// let fileExtension = path.extname(file.originalname).split(".")[1];
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname)
		);
	}
});

const upload = multer({
	storage: storage,
	limit: {
		fileSize: 1000000
	}
});

router.get('/newsfeed', newsfeedController.getNewsfeed);
router.post(
	'/newsfeed',
	upload.single('post_image'),
	newsfeedController.postRant
);

module.exports = router;
