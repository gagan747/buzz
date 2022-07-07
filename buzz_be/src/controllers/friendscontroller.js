/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Users = require('../models/users');
const logger = require('../logger/index');

async function addFriend(req, res) {
  try {
    const { friendid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(friendid)) { return res.status(404).send(`Not a valid id: ${friendid}`); }
    const user = await Users.findById(req.user_id);
    const friend = await Users.findById(friendid);
    if (!friend) { return res.status(401).json({ message: 'User dont exist' }); }
    if (user.friends.myFriendRequests.includes(friendid)) { return res.status(401).json({ message: 'Already Requested' }); }
    if (user.friends.myFriends.includes(friendid)) { return res.status(401).json({ message: 'Already added as friend' }); }
    if (user.friends.mySentRequests.includes(friendid)) { return res.status(401).json({ message: 'Request already sent' }); }
    user.friends.mySentRequests.push(friendid);
    friend.friends.myFriendRequests.push(req.user_id);
    await user.save();
    await friend.save();
    res.status(201).json({ message: 'Request Sent Sucessfully' });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: ` ${err}` });
  }
}

async function getFriendRequests(req, res) {
  try {
    const user = await Users.findById(req.user_id).populate('friends.myFriendRequests', 'firstname lastname profile_img');
    const friendData = user.friends.myFriendRequests;
    res.status(200).json(friendData);
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: ` ${err}` });
  }
}

async function acceptRequest(req, res) { // for accepting of friend request from receiver
  try {
    const { friendid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(friendid)) { return res.status(404).send(`Not a valid id: ${friendid}`); }
    const user = await Users.findById(req.user_id);
    const friend = await Users.findById(friendid);
    if (!friend) { return res.status(401).json({ message: 'User dont exist' }); }
    if (!user.friends.myFriendRequests.includes(friendid)) { return res.status(401).json({ message: 'Not requested' }); }
    if (user.friends.myFriends.includes(friendid)) { return res.status(400).json({ message: 'Already a friend' }); }
    user.friends.myFriendRequests = user.friends.myFriendRequests.filter((request) => request.toString() !== friendid);
    friend.friends.mySentRequests = friend.friends.mySentRequests.filter((request) => request.toString() !== user._id.toString());
    user.friends.myFriends.push(friendid);
    friend.friends.myFriends.push(user._id);
    await user.save();
    await friend.save();
    res.status(201).json({ message: 'Request accepted' });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: ` ${err}` });
  }
}

async function cancelRequest(req, res) { // for rejection of friend request from receiver
  try {
    const { friendid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(friendid)) { return res.status(404).send(`Not a valid id: ${friendid}`); }
    const me = await Users.findById(req.user_id);
    const friend = await Users.findById(friendid);
    if (!friend) { return res.status(401).json({ message: 'User dont exist' }); }
    if (!me.friends.myFriendRequests.includes(friendid)) {
      return res.status(400).json({ message: 'Not requested' });
    }
    me.friends.myFriendRequests = me.friends.myFriendRequests.filter((request) => request.toString() !== friendid);
    friend.friends.mySentRequests = friend.friends.mySentRequests.filter((request) => request.toString() !== me._id.toString());
    await me.save();
    await friend.save();
    res.status(201).json({ message: 'Request cancelled' });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: ` ${err}` });
  }
}

async function unFriend(req, res) {
  try {
    const { friendid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(friendid)) { return res.status(404).send(`Not a valid id: ${friendid}`); }
    const me = await Users.findById(req.user_id);
    const friend = await Users.findById(friendid);
    if (!friend) { return res.status(401).json({ message: 'User dont exist' }); }
    if (!me.friends.myFriends.includes(friendid)) { return res.status(400).json({ message: 'Already not friends' }); }
    me.friends.myFriends = me.friends.myFriends.filter((friends) => friends.toString() !== friendid);
    friend.friends.myFriends = friend.friends.myFriends.filter((friends) => friends.toString() !== me._id.toString());
    await me.save();
    await friend.save();
    res.status(201).json({ message: 'Removed as a Friend' });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: ` ${err}` });
  }
}

async function getFriends(req, res) {
  try {
    const me = await Users.findById(req.user_id).populate('friends.myFriends', 'firstname lastname profile_img');
    myFriends = me.friends.myFriends;
    res.status(200).json(myFriends);
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: ` ${err}` });
  }
}

async function deleteRequest(req, res) { // for deletion of friend request from sender
  try {
    const { friendid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(friendid)) { return res.status(404).send(`Not a valid id: ${friendid}`); }
    const me = await Users.findById(req.user_id);
    const friend = await Users.findById(friendid);
    if (!friend) { return res.status(401).json({ message: 'User dont exist' }); }
    if (friend.friends.myFriends.includes(me._id.toString())) { return res.status(400).json({ message: 'Already friends' }); }
    if (!me.friends.mySentRequests.includes(friendid)) { return res.status(400).json({ message: ' Not requested' }); }
    me.friends.mySentRequests = me.friends.mySentRequests.filter((request) => request.toString() !== friendid);
    friend.friends.myFriendRequests = friend.friends.myFriendRequests.filter((request) => request.toString() !== me._id.toString());
    await me.save();
    await friend.save();
    res.status(201).json({ message: 'Request deleted' });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: ` ${err}` });
  }
}
module.exports = {
  getFriends, cancelRequest, unFriend, deleteRequest, addFriend, getFriendRequests, acceptRequest,
};
