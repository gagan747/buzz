const mongoose = require('mongoose');

const feeds = new mongoose.Schema({

  User: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment',
  }],
  comment: {
    type: String,
    minlength: 5,
    maxlength: 10,
  },
  updated_At: {
    type: Date, default: new Date(),
  },
  created_At: {
    type: Date, default: new Date(),
  },
});

module.exports = mongoose.model('myfeed', feeds);
