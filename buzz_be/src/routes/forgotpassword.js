const router = require('express').Router();
const forgotpassword = require('../controllers/forgotpassword');
const otpgenerator = require('../controllers/otpgenerator');

router.post('/', forgotpassword);
router.post('/otpgenerator', otpgenerator);

module.exports = router;
