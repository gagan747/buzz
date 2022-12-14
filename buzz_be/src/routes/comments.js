/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const router = require('express').Router();
const Comments = require('../models/comment');
const validateComment = require('../middleware/commentValidation');
const logger = require('../logger/index');

// Create Comment

router.post('/:feed_Id', validateComment, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.feed_Id)) { return res.status(404).json({ message: `Not a valid id: ${req.params.feed_Id}` }); }
    const { comment } = req.body;
    const user_Id = req.user_id;
    const { feed_Id } = req.params;
    const commentData = new Comments({ comment, user_Id, feed_Id });
    await commentData.save();
    await commentData.populate('user_Id');

    res.status(200).json({ message: 'Comment added', data: commentData });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: `${err}` });
  }
});
// Read Comment
router.get('/:feed_Id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.feed_Id)) { return res.status(404).json({ message: `Not a valid id: ${req.params.feed_Id}` }); }
    const result = await Comments.find({ feed_Id: req.params.feed_Id }).populate('user_Id', 'firstname lastname profile_img ').select('comment user_Id');
    if (result) { return res.status(201).json(result); }
    return res.status(400).json({ message: 'Failed to fetch' });
  } catch (err) {
    logger.error(err);
    return res.status(400).json({ message: `${err}` });
  }
});
// Update Comment
router.patch('/:commentid', validateComment, async (req, res) => {
  try {
    const commentbox = await Comments.findOne({ _id: req.params.commentid });
    if (!commentbox) { return res.status(400).json({ message: 'Comment not found!!' }); }
    if (!(commentbox.user_Id.toString() === req.user_id.toString())) { return res.status(401).json({ message: 'You can only update your comments' }); }
    commentbox.comment = req.body.comment;
    await commentbox.save();
    return res.status(200).json({ message: 'Comment updated', data: commentbox });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: ` ${err}` });
  }
});
// Delete Comment
router.delete('/:commentid', async (req, res) => {
  try {
    const comment = await Comments.findOne({ _id: req.params.commentid });
    if (!comment) { return res.status(400).json({ message: 'Comment not found!!' }); }
    if (!(comment.user_Id.toString() === req.user_id.toString())) { return res.status(401).json({ message: 'You can only delete your comments' }); }
    const result = await Comments.deleteOne({ _id: req.params.commentid });
    if (result.acknowledged && result.deletedCount === 1) { return res.status(200).json({ message: 'Comment deleted' }); }
    res.status(400).json({ message: 'Something went wrong' });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: ` ${err}` });
  }
});

module.exports = router;
