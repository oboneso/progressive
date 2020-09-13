const express = require('express')
const User = require('../models/User')
const { logout, getLogin, postLogin } = require('../controllers/users')
// const LoginLogoutTracker = require('../models/LoginLogoutTracker')
const { ensureAuthenticated } = require('../config/auth')
const bcrypt = require('bcryptjs')
const ErrorResponse = require('../utils/errorResponse')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('welcome')
})

router.route('/login').get(getLogin)
router.route('/login').post(postLogin)

router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
  res.render('users/dashboard')
})

router.get('/register', (req, res) => {
  res.render('users/register')
})

router.post('/register', (req, res, next) => {
  // Save user data to variables
  const { name, username, email, password, password2 } = req.body
  // Initialize errors array for validation handling
  const errors = []
  // Check for empty user inputs
  if (!name || !username || !email || !password || !password2) {
    // If any field is missing, add msg object to errors array
    errors.push({ msg: 'All fields are required' })
  }
  // Check password min. length
  if (password.length < 6) {
    errors.push({ msg: 'Password must be a minimum of 6 characters' })
  }
  // Check password equality
  if (password !== password2) {
    errors.push({ msg: 'Passwords must match' })
  }
  // Check array for errors, if errors render register page with data
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
    // Check for unique/existing email
    User.findOne({ email: email })
      .then(user => {
        // If email exists, add error to array
        if (user) {
          errors.push({ msg: 'Email aleady in use' })
          res.render('users/register', {
            errors,
            name,
            username,
            email,
            password,
            password2
          })
        } else {
          // If no errors, create new user
          const newUser = new User({
            name,
            username,
            email,
            password
          })
          // Hash password for encrypted db storage
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              next(new ErrorResponse(`Error with bcrypt has ${err}`))
            }
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                next(new ErrorResponse(`Error with bcrypt has ${err}`))
              }
              newUser.password = hash
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in')
                  res.redirect('/login')
                })
                .catch((err) => {
                  next(new ErrorResponse(`Error with bcrypt hash: ${err}`)
                  )
                })
            })
          })
        }
      })
  }
})

router.get('/portfolio', ensureAuthenticated, (req, res, next) => {
  res.render('users/portfolio')
})

router.route('/logout').get(logout)

module.exports = router

/** ------------------------------------------------------------------------
*     @ LOGOUT
*     @ APP/user/logout
* ------------------------------------------------------------------------ */
// router.get('/logout', (req, res) => {
//   console.log(req)
//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('/login');
// });
/** ------------------------------------------------------------------------ */
