/* eslint-disable no-unused-expressions */
require('dotenv').config;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const config = require('config');

passport.serializeUser((user, cb) => {
  console.log('serealize', user);
  cb(null, user);
 
 
});
passport.deserializeUser((obj, cb) => {
  console.log('deserealize', "meow");

  cb(null, "meow");
});
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.CALLBACK_URL,
}, ((accessToken, refreshToken, profile, done) => {
  console.log('strategy',profile.provider)
  done(null, { profile });
})));
