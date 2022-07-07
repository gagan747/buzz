/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/order */
const bcrypt = require('bcryptjs');
const Users = require('../models/users.js');
const getAgeFromDob = require('../utils/getAgeFromDob.js');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../logger/index');

async function userlogin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User Not Found' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign(
        { _id: user._id, is_Admin: user.is_Admin },
        process.env.JWT_SECRET_KEY,
      );
      res.header('x-auth-token', token);
      return res.status(200).json({ message: 'Success' });
    }
    res.status(401).json({ message: 'Invalid Password' });
  } catch (err) {
    return res.status(401).json({ message: ` ${err}` });
  }
}

async function registerdata(req, res, next) {
  try {
    const {
      email, password, firstname, lastname, city, state, country, gender, dob,
    } = req.body;
    const user = new Users({
      email, password, firstname, lastname, city, state, country, gender, dob,
    });
    user.age = getAgeFromDob(user.dob);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    const token = jwt.sign(
      { _id: user._id, is_Admin: user.is_Admin },
      process.env.JWT_SECRET_KEY,
    );
    res.header('x-auth-token', token);
    res.status(201).json({ message: 'User registered Successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(400).json({ message: `${err}` });
  }
}
module.exports.register = registerdata;
module.exports.login = userlogin;
