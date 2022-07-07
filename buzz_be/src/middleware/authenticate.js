/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const logger = require('../logger/index');

async function Authenticate(req, res, next) {
  try {
    if (req.headers.token === 'null') {
      res.status(307).json({ message: 'redirect' });
      return;
    }
    const { token } = req.headers;
    const verifytoken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const rootuser = await User.findOne({ _id: verifytoken._id, is_Admin: verifytoken.is_Admin });
    if (!rootuser) { throw new Error('redirect'); }
    req.user = rootuser;
    req.user_id = rootuser._id;
    next();
  } catch (err) {
    logger.error(err);
    res.status(307).json({ message: 'redirect' });
  }
}
module.exports = Authenticate;
