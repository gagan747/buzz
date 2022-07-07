/* eslint-disable max-len */
const router = require('express').Router();
const User = require('../models/users');
const logger = require('../logger/index');

router.get('/', async (req, res) => {
  try {
    const me = await User.findById(req.user_id);
    const notsuggested = [req.user_id, ...me.friends.myFriends, ...me.friends.myFriendRequests, ...me.friends.mySentRequests];
    const users = await User.find({ _id: { $nin: notsuggested } }).select('firstname lastname profile_img friends').sort({ firstname: 1 });
    res.status(200).json(users);
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: ` ${err}` });
  }
});

module.exports = router;
