const { ensureAuthenticated } = require('../config/auth')
const User = require('../models/User')
const passport = require('passport')

exports.getLogin = (req, res) => {
  res.render('users/login')
}

exports.postLogin = (ensureAuthenticated, (req, res, next) => {
  const username = req.body.username
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      throw err
    } else {
      passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
      })(req, res, next)
    }
  })
})

exports.logout = async (req, res, next) => {
  try {
    await req.session.destroy(function (err) {
      if (err) {
        return next(err)
      }
      console.log(req.session)
      // destroy session data
      req.session = null
      console.log(req.session)
    })
    // redirect to homepage
    res.redirect('/')
  } catch (err) {
    next(err)
  };
}
