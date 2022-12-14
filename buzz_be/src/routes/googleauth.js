/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
const router = require('express').Router();
require('../controllers/googleauth.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const Users = require('../models/users.js');
const logger = require('../logger/index');

router.get('/', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));
router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/auth/fail' }),
  async (req, res, next) => {
    console.log('meow',req.user)
    try {
      if (!/^[A-Za-z0-9._]{3,30}@tothenew.com$/.test(req.user.profile._json.email)) {
        res.redirect(config.get('LOGINPAGE_URL'));
        return;
      }
      const result = await Users.findOne({ email: req.user.profile._json.email });
      if (!result) {
        req.user.profile._json.given_name = req.user.profile._json.given_name.replaceAll(' ', '');
        const user = new Users({
          email: req.user.profile._json.email,
          firstname: req.user.profile._json.given_name,
          profile_img: req.user.profile._json.picture,
          lastname: req.user.profile._json.family_name,
        });
        user.password = await bcrypt.hash(user.email, 10);
        await user.save();
        const token = jwt.sign(
          { _id: user._id, is_Admin: user.is_Admin },
          process.env.JWT_SECRET_KEY,
        );
       
        res.redirect(`${config.get('HOME_URL')}/${token}`);
        return;
      }
      const token = jwt.sign(
        { _id: result._id, is_Admin: result.is_Admin },
        process.env.JWT_SECRET_KEY,
      );
      console.log('before serealize')
      res.redirect(`${config.get('HOME_URL')}/${token}`);
      return;
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: `${err}` });
    }
  },
);
router.get('/auth/fail', (req, res, next) => {
  res.status(401).json({ message: 'Unauthorized' });
});

module.exports = router;
