/* eslint-disable import/extensions */
const router = require('express').Router();
const upload = require('../utils/multer');
const userProfileController = require('../controllers/userProfileController.js');

router.get('/', userProfileController.viewUserProfile);
router.put('/update', upload.single('profileImg'), userProfileController.updateUserProfile);

module.exports = router;
