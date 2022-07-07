/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable global-require */
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const config = require('config');
const cookieParser = require('cookie-parser');
const comments = require('./routes/comments');
const friends = require('./routes/friends');
const searchsuggestions = require('./routes/searchsuggestions');
const suggestions = require('./routes/suggestions.js');
const app = express();
require('dotenv').config();
const feed = require('./routes/feed');
const userProfile = require('./routes/userProfile');
const userauth = require('./routes/auth.js');
const googleauth = require('./routes/googleauth.js');
const forgotpassword = require('./routes/forgotpassword.js');
const moderator = require('./routes/moderator');
const viewProfile = require('./routes/viewProfile');
const friendFeeds = require('./routes/friendFeeds');
const setHeader = require('./controllers/setHeader');
const authenticate = require('./middleware/authenticate');

mongoose.connect(config.get('MONGO_URI'))
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error(`${err}`));
app.use(cors(
  {
    origin: '*',
    credentials: 'true',
  },
));
app.use(setHeader);
app.use(express.json());
app.use(cookieParser());
app.use('/api/comments', authenticate, comments);
app.use('/api/friends', authenticate, friends);
app.use('/api/feed', authenticate, feed);
app.use('/api', userauth);
app.use('/api/search', searchsuggestions);
app.use('/auth/google', googleauth);
app.use('/api/forgotpassword', forgotpassword);
app.use('/api/userprofile', authenticate, userProfile);
app.use('/api/moderator', moderator);
app.use('/api/suggestions', authenticate, suggestions);
app.use('/api/viewProfile', authenticate, viewProfile);
app.use('/api/friendFeeds', friendFeeds);
app.get('/api/home', authenticate, async (req, res) => {
  res.status(200).json({
    fName: req.user.firstname,
    lName: req.user.lastname,
    userId: req.user_id,
    profileImg: req.user.profile_img,
    is_Admin: req.user.is_Admin,
    profile_img: req.user.profile_img,
    user_id: req.user_id,
    friendRequestCount: req.user.friends.myFriendRequests.length,
  });
});
process.on('uncaughtException', (ex) => {
  console.log('We got uncaught exception', ex);
  process.exit(1);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: `${err}` });
});
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('buzz_fe/build'));
  const path = require('path');
  app.get('*', (req, res) => { res.sendFile(path.resolve(__dirname, 'buzz_fe', 'build', 'index.html')); });
}
app.listen(config.get('PORT'), () => console.log(`Listening on port ${config.get('PORT')}...`));
