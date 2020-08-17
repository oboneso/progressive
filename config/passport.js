/** 
 * @fileoverview Description of file, its uses and information about its dependencies.
 * 
 *  Passport Authentication:
 *    - To authenticate a user, passport requries a configured authentication strategy.
 *    - The passport.use() function supplies the strategy to our app. 
 *
 * @packages (external)
 *  @mongoose @passport @passport-local @bcryptjs 
 * 
 * @packages (internal)
 *  @User (User Schema/Model)
 */


const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');


module.exports = function (passport) {

  passport.use(new LocalStrategy((username, password, done) => {

    User.findOne({ username: username }, (err, user) => {
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password Incorrect' });
        }
      });
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

};