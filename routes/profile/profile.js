const bodyParser = require('body-parser')
const passport = require('passport');
const express = require('express');
const bcrypt = require('bcryptjs');

const LoginLogoutTracker = require('../../models/LoginLogoutTracker');
const { ensureAuthenticated } = require('../../config/auth')
const User = require('../../models/User');
const blogPost = require('../../models/Blog')

const router = express.Router();

// GET - APP/users/login
router.get('/profile', (req, res) => {
  res.render('profile/profile', {
    name: req.user.name,
    username: req.user.username,
    id: req.user._id,
    email: req.user.email
  });

});

module.exports = router;