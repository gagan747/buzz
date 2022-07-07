/* eslint-disable prefer-regex-literals */
/* eslint-disable consistent-return */
const Joi = require('joi');
const logger = require('../logger/index');

const registerSchema = Joi.object({
  gender: Joi.string().required().valid('Male', 'Female', 'Other'),
  password: Joi.string().required().min(8).max(15)
    .pattern(new RegExp('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#%])')),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  dob: Joi.date().required(),
});

async function registerValidation(req, res, next) {
  try {
    const {
      city, state, country, password, gender, dob,
    } = req.body;
    await registerSchema.validateAsync(
      {
        city, state, country, password, gender, dob,
      },
    );
    next();
  } catch (err) {
    logger.error(err);
    if (err.details[0].message.indexOf('password') !== -1) {
      return res.status(400).json({ message: ' Password  must be min 8 and max 15 characters long , have atleast one uppercase letter,number and a special character ' });
    }
    return res.status(400).json({ message: `${err}` });
  }
}
module.exports = registerValidation;
