/* eslint-disable no-unused-expressions */
require('dotenv').config;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const config = require('config');

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: config.get('CALLBACK_URL'),
}, ((accessToken, refreshToken, profile, done) => {
  done(null, { profile });
})));
