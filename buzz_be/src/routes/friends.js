const router = require('express').Router();
const friendscontroller = require('../controllers/friendscontroller');

router.post('/addfriend/:friendid', friendscontroller.addFriend);
router.get('/getFriendRequests', friendscontroller.getFriendRequests);
router.post('/acceptRequest/:friendid', friendscontroller.acceptRequest);
router.post('/unFriend/:friendid', friendscontroller.unFriend);
router.get('/getFriends', friendscontroller.getFriends);
router.post('/cancelRequest/:friendid', friendscontroller.cancelRequest);
router.post('/deleteRequest/:friendid', friendscontroller.deleteRequest);
module.exports = router;
