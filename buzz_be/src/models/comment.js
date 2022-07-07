const mongoose = require('mongoose');

const Comments = new mongoose.Schema({

  comment: {
    type: String,
    minlength: 5,
    required: true,
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  feed_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  updated_At: {
    type: Date, default: Date.now(),
  },
  created_At: {
    type: Date, default: Date.now(),
  },
});

module.exports = mongoose.model('COMMENTS', Comments);
