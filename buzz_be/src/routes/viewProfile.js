/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
const router = require('express').Router();
const mongoose = require('mongoose');
const users = require('../models/users.js');
const logger = require('../logger/index');

router.get('/:id', async (req, res) => {
  try {
    const userid = req.params.id;
    const currUserId = req.user_id;
    if (!mongoose.Types.ObjectId.isValid(userid)) {
      return res.status(404).send(`Not a valid id: ${userid}`);
    }
    const user = await users.findById(userid);
    if (user) {
      res.status(200).json({ user, currUserId });
    } else {
      res.status(404).json('No user with given id');
    }
  } catch (error) {
    logger.error(error);
    res.status(400).json({ message: `${error}` });
  }
});

module.exports = router;
