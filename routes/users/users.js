const express = require('express');
const User = require('../../models/User');
const LoginLogoutTracker = require('../../models/LoginLogoutTracker');
const TodoTask = require('../../models/TodoTask');
const BlogPost = require('../../models/Blog')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../../config/auth')
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const upload = require('../../services/ImageUpload')
// const upload = multer({ dest: 'media/uploads' });
const singleUpload = upload.single("image");
const bodyParser = require('body-parser')


const router = express.Router();


router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/login', async (req, res, next) => {
  const username = req.body.username;
  const user = await User.find({ username })
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Dashboard ------------------------------------------------------
// Dashboard - GET dashboard page
router.get('/dashboard', ensureAuthenticated, async (req, res, next) => {
  const ip_address = req.connection.remoteAddress
  const userId = req.user._id;
  const name = req.user.name;
  const username = req.user.username;
  try {
    const tracker = new LoginLogoutTracker({ userId, name, username, login: true, logout: false, ip_address: ip_address })
    await tracker.save();

  } catch (err) {
    console.log(err)
    res.render('users/dashboard');
  }
  console.log(`New login:  @${username}  |  Name: ${name} | userID: "${userId}" |`)

  res.render('users/dashboard')
});



router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', (req, res) => {
  console.log(`New user registered: ${req.body}`)
  const { name, username, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !username || !email || !password || !password2) {
    errors.push({ msg: 'All fields are required' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be a minimum of 6 characters' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords must match' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name,
      username,
      email,
      password,
      password2
    })
  } else {
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          errors.push({ msg: 'Email aleady in use' });
          res.render('users/register', {
            errors,
            name,
            username,
            email,
            password,
            password2
          })
        } else {
          const newUser = new User({
            name,
            username,
            email,
            password
          });
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;

              newUser.password = hash;

              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in')
                  res.redirect('/users/login')
                })
                .catch(err => console.log(err))
            })
          )
        }
      })
  }
});




// router.get('/:id', ensureAuthenticated, (req, res) => {
//   res.render('users/dashboard')
// });



router.get('/logout', ensureAuthenticated, async (req, res) => {
  const ip_address = req.connection.remoteAddress
  const userId = req.user._id;
  const name = req.user.name;
  const username = req.user.username;
  try {
    const tracker = new LoginLogoutTracker({ userId, name, username, login: true, logout: false, ip_address: ip_address })
    await tracker.save();

  } catch (err) {
    console.log(err)
    res.render('users/dashboard');
  }
  console.log(`New logout: @${username}  |  Name: ${name} | userID: "${userId}" |`)

  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});


module.exports = router;