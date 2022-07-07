/* eslint-disable consistent-return */
const Users = require('../models/users');
const generateOtp = require('../utils/generateotp');
const mailgenerator = require('../utils/mailgenerator');
const Otp = require('../models/otp');
const logger = require('../logger/index');

async function otpGenerator(req, res) {
  try {
    const { email } = req.body;
    const result = await Users.findOne({ email });
    if (!result) { return res.status(401).json({ message: 'User not found' }); }
    const otp = await generateOtp(email);
    if (!otp) {
      res.status(400).json({ message: 'Something went wrong' });
      return;
    }
    const state = await mailgenerator(email, otp);
    if (!state) { return res.status(400).json({ message: 'Something went wrong while sending email' }); }
    res.status(201).json({ message: 'Email sent successfully' });
    await Otp.deleteMany({ email, otp: { $nin: [otp] } });
  } catch (err) {
    logger.error(err);
    res.status(401).json({ message: `${err}` });
  }
}
module.exports = otpGenerator;
