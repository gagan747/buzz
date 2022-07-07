const router = require('express').Router();
const moderatorcontroller = require('../controllers/moderatorcontroller');
const authenticate = require('../middleware/authenticate');

router.delete('/deletepost/:id', authenticate, moderatorcontroller.deletePost);
router.post('/poststatus/:id', authenticate, moderatorcontroller.postStatus);
router.get('/getFeeds', authenticate, moderatorcontroller.getFeeds);
module.exports = router;
