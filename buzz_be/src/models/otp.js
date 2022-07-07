const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {
    type: String,
    default: '',
  },
  otp: {
    type: String,
    default: '',
  },
});
const Otp = mongoose.model('OTP', schema);
module.exports = Otp;
