/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const Feed = require('../models/feed');
const cloudinary = require('../utils/cloudinary');
const logger = require('../logger/index');

const createFeed = async (req, res) => {
  const { text } = req.body;
  const userid = req.user_id.toString();
  const userName = `${req.user.firstname} ${req.user.lastname}`;

  try {
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    // instance of post
    const feeddata = {
      createdBy: userid,
      text,
      status: 'active',
      imgLink: result?.secure_url || '',
      cloudinaryId: result?.public_id || '',
      userName,
    };
    const feed = new Feed(feeddata);
    await feed.populate('createdBy', 'firstname lastname profile_img ');
    // saving post
    await feed.save();
    res.status(201).json({ message: 'success', feed });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ message: `${error}` });
  }
};

const getFeeds = async (req, res) => {
  try {
    const { pageLimit, pageNumber } = req.query;
    feedCount = await Feed.find({ status: 'active', createdBy: { $in: [req.user_id, ...req.user.friends.myFriends] } }).count();
    const feeds = await Feed.find({ status: 'active', createdBy: { $in: [req.user_id, ...req.user.friends.myFriends] } }).populate('createdBy', 'firstname lastname profile_img ').sort({ createdAt: -1 }).limit(pageLimit)
      .skip((pageNumber - 1) * pageLimit);
    res.status(200).json({ feedCount, pageCount: feeds.length, feeds });
  } catch (error) {
    logger.error(error);
    res.status(400).json({ message: `${error}` });
  }
};

const deleteFeed = async (req, res, next) => {
  try {
    // valid object id check
    userid = req.user_id.toString();
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`Not a valid id: ${id}`);
    // post find
    const feed = await Feed.findById(id);
    if (feed) {
      // delete from cloudinary
      if (feed.createdBy.toString() === userid) {
        feed.cloudinaryId
          && (await cloudinary.uploader.destroy(feed.cloudinaryId));
        // delete post from db
        await feed.remove();
        res.status(200).json({ message: 'Post deleted', feeddata: feed });
      } else { res.status(401).json({ message: 'Invalid User' }); }
    } else { res.status(401).json({ message: 'Feed not found' }); }
  } catch (error) {
    logger.error(error);
    res.status(400).json({ message: `${error}` });
  }
};

const updateFeed = async (req, res, next) => {
  try {
    let result;
    const { id } = req.params;
    userid = req.user_id.toString();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`Not a valid id: ${id}`);
    }
    let feed = await Feed.findById(id);
    if (feed.createdBy === userid) {
      // Delete image from cloudinary
      if (req.file) {
        feed.cloudinaryId
          && (await cloudinary.uploader.destroy(feed.cloudinaryId));
        // // Upload image to cloudinary
        result = await cloudinary.uploader.upload(req.file.path);
      }
    } else {
      res.status(401).json('Invalid User');
    }
    const feeddata = {
      imgLink: result?.secure_url || feed.imgLink,
      cloudinaryId: result?.public_id || feed.cloudinaryId,
      text: req.body.text,
    };
    feed = await Feed.findByIdAndUpdate(id, feeddata, { new: true });
    res.status(200).json(feed);
  } catch (err) {
    logger.error(error);
    res.status(400).json({ message: `${err}` });
  }
};
const likeFeed = async (req, res, next) => {
  try {
    // getting ids
    const feedid = req.params.id;
    const userid = req.user_id.toString();
    // validating
    if (!mongoose.Types.ObjectId.isValid(feedid)) return res.status(404).send(`Not a valid id: ${feedid}`);
    // finding in db
    const feed = await Feed.findById(feedid);
    if (feed) {
      // checking for existence of id
      const index = userid && feed.likeCount.findIndex((id) => id === userid);
      if (index === -1) {
        feed.likeCount.push(userid); // pushing if id not present
      } else {
        feed.likeCount = feed.likeCount.filter((id) => id !== userid); // removing if id is present
      }
      // updation in feeddatabase
      const updatedFeed = await Feed.findByIdAndUpdate(feedid, feed, { new: true });
      res.status(200).json(updatedFeed);
    } else { res.status(404).json('No post with given id'); }
  } catch (error) {
    logger.error(error);
    res.status(400).json({ message: `${error}` });
  }
};
const flagFeed = async (req, res, next) => {
  try {
    // getting ids
    const feedid = req.params.id;
    const userid = req.user_id.toString();
    // validating
    if (!mongoose.Types.ObjectId.isValid(feedid)) return res.status(404).send(`Not a valid id: ${feedid}`);
    // finding in db
    const feed = await Feed.findById(feedid);
    if (feed && feed.createdBy !== userid) {
      // checking for existence of id
      const index = userid && feed.flagCount.findIndex((id) => id === userid);
      if (index === -1) {
        feed.flagCount.push(userid); // pushing if id not present
      } else {
        feed.flagCount = feed.flagCount.filter((id) => id !== userid); // removing if id is present
      }
      // updation in feeddatabase
      const updatedFeed = await Feed.findByIdAndUpdate(feedid, feed, { new: true });
      res.status(200).json(updatedFeed);
    } else { res.status(404).json({ message: 'No post with given id or cannot flag self' }); }
  } catch (error) {
    logger.error(error);
    res.status(400).json({ message: `${error}` });
  }
};
module.exports = {
  createFeed, getFeeds, deleteFeed, updateFeed, likeFeed, flagFeed,
};
