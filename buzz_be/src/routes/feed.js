/* eslint-disable import/extensions */
const router = require('express').Router();
const upload = require('../utils/multer');
const feedController = require('../controllers/feedController.js');
const feedValidation = require('../middleware/feedValidation.js');

router.get('/', feedController.getFeeds);
router.post('/', upload.single('photos'), feedValidation, feedController.createFeed);
router.put('/:id', upload.single('photos'), feedValidation, feedController.updateFeed);
router.delete('/:id', feedController.deleteFeed);
router.put('/like/:id', feedController.likeFeed);
router.put('/flag/:id', feedController.flagFeed);

module.exports = router;
