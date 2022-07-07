/* eslint-disable consistent-return */
const router = require('express').Router();
const mongoose = require('mongoose');
const Feed = require('../models/feed');
const logger = require('../logger/index');

router.get('/:id', async (req, res) => {
  try {
    const friendId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(404).send(`Not a valid id: ${friendId}`);
    }
    const feeds = await Feed.find({ status: 'active', createdBy: friendId }).populate('createdBy', 'firstname lastname profile_img ').sort({ createdAt: -1 });
    res.status(200).json({ feedCount: feeds.length, feeds });
  } catch (error) {
    logger.error(error);
    res.status(400).json({ message: `${error}` });
  }
});

module.exports = router;
