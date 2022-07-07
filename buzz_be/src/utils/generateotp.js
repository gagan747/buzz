/* eslint-disable import/newline-after-import */
/* eslint-disable no-plusplus */
/* eslint-disable import/extensions */
const Otp = require('../models/otp.js');
const logger = require('../logger/index');
async function generateOtp(email) {
  try {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 4; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    const userotp = new Otp({
      email, otp,
    });
    const result = await userotp.save();
    if (!result) {
      return false;
    }
    return otp;
  } catch (err) {
    logger.error(err);
    return false;
  }
}
module.exports = generateOtp;
