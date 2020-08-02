var express = require('express');
const { getMessagePage } = require('../controllers/messageControllers');
var router = express.Router();

// @desc        GET message page.
// @route       GET /users/message
// @access      Private
router.get('/message', getMessagePage);

module.exports = router;
