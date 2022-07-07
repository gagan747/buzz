const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: '',
      ref: 'Users',
    },
    userName: {
      type: String,
    },
    text: {
      type: String,
      trim: true,
      minlength: [5, 'minimum length should  be 5'],
      maxlength: [1000, 'Length of text should be less.'],
    },
    imgLink: {
      type: String,
    },
    cloudinaryId: {
      type: String,
    },
    likeCount: {
      type: Array,
      default: [],
    },
    flagCount: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('feed', feedSchema);
