/* eslint-disable no-unused-vars */
const res = require('express/lib/response');
const nodemailer = require('nodemailer');
const logger = require('../logger/index');

async function mailGenerator(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      post: 587,
      secure: false,
      auth: {
        user: 'letschatwithbuzz@gmail.com',
        pass: 'oksoycysrylirhpd',
      },
    });
    const mailOptions = {
      from: 'letschatwithbuzz@gmail.com',
      to: email,
      subject: 'Password reset mail',
      text: `Find below the otp for reseting password ${otp}`,
    };
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
}
module.exports = mailGenerator;
