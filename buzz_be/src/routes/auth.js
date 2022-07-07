/* eslint-disable import/extensions */
const express = require('express');

const router = express.Router();
const userValidation = require('../middleware/userValidation.js');
const loginValidation = require('../middleware/loginValidation.js');
const authcontroller = require('../controllers/authcontroller');

const { login, register } = authcontroller;

router.post('/login', loginValidation, login);
router.post('/register', userValidation, register);

module.exports = router;
