const express = require('express');
const User = require('../models/User');
const TodoTask = require('../models/TodoTask');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth')

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
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
            email,
            password,
            password2
          })
        } else {
          const newUser = new User({
            name,
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

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  req.logout();
  req.flash('succes_msg', 'You are logged out');
  res.redirect('/');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('users/dashboard', { name: req.user.name });
});

router.get('/blog', ensureAuthenticated, (req, res) => {
  res.render('users/blog', { name: req.user.name });
});

router.get('/portfolio', ensureAuthenticated, (req, res) => {
  res.render('users/portfolio', { name: req.user.name });
});

router.get('/todo', ensureAuthenticated, (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render('users/todo', { todoTasks: tasks });
  })
});

router.post('/todo', async (req, res) => {
  const { content } = req.body
  let errors = [];
  console.log(content)
  if (!content) {
    errors.push({ msg: 'Please make sure to press the submit button' });
  }

  if (errors.length > 0) {
    req.flash('error_msg', 'Please press submit')
    res.redirect('/users/todo');
  } else {
    try {
      const todoTask = new TodoTask({ content: content })
      await todoTask.save();
      req.flash('success_msg', 'Todo Added!');
      res.redirect('/users/todo');
    } catch (err) {
      console.log(err)
      res.redirect('users/todo');
    }
  }
});

router.route("/todo/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, err => {
    if (err) {
      return res.send(500, err);
      res.redirect('/users/todo')
    }
    req.flash('sucess_msg', 'Todo removed!');
    res.redirect('/users/todo')
  });
});


module.exports = router;