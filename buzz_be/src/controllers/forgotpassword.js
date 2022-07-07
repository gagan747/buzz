/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-regex-literals */
const bcrypt = require('bcryptjs/dist/bcrypt');
const Joi = require('joi');
const Users = require('../models/users');
const Otp = require('../models/otp');
const logger = require('../logger/index');

const schema = Joi.object({
  newpassword: Joi.string().required().min(8).max(15)
    .pattern(new RegExp('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#%])')),
});

async function forgotPassword(req, res) {
  try {
    const { email, otp, newpassword } = req.body;
    const result = await Users.findOne({ email });
    if (!result) { throw new Error('User not found'); }
    const otpvalidate = await Otp.findOne({ email, otp });
    if (!otpvalidate) { throw new Error('Otp invalid'); }
    await schema.validateAsync({ newpassword }).catch(() => { throw new Error(' Password  must be min 8 and max 15 characters long , have atleast one uppercase letter,number and a special character '); });
    const acknowledged = await Otp.deleteOne({ _id: otpvalidate._id });
    if (!acknowledged.deletedCount > 0) { throw new Error('Something went wrong'); }
    result.password = await bcrypt.hash(newpassword, 10);
    await result.save();
    return res.status(201).json({ message: 'Password reset successfully' });
  } catch (err) {
    logger.error(err);
    return res.status(401).json({ message: `${err}` });
  }
}
module.exports = forgotPassword;
