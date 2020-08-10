const express = require('express');
const User = require('../models/User');
const TodoTask = require('../models/TodoTask');
const BlogPost = require('../models/Blog')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth')
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const upload = require('../services/ImageUpload')
// const upload = multer({ dest: 'media/uploads' });
const singleUpload = upload.single("image");
const bodyParser = require('body-parser')

const CONFIG = require('../config');
const google = require('googleapis').google;
const jwt = require('jsonwebtoken');
const OAuth2 = google.auth.OAuth2;
const cookieParser = require("cookie-parser");


const router = express.Router();

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', (req, res) => {
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

router.post('/login', (req, res, next) => {
  console.log(req.params)
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

// Dashboard ------------------------------------------------------
// Dashboard - GET dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  const { name, id, email } = (req.user)
  res.render('users/dashboard', {
    name: req.user.name,
    id: req.user._id,
    email: req.user.email
  });
});

// Blog App ------------------------------------------------------
// Blog App - GET blog page
router.get('/blog', ensureAuthenticated, (req, res) => {
  const userId = req.user.id
  BlogPost.find({ userId: userId }, (err, posts) => {
    res.render('users/blog', {
      blogPost: posts,
      name: req.user.name,
      username: req.user.username,
      id: req.user._id,
      email: req.user.email,
      date: req.body.date
    });
  })
});
router.get('/blog-new', ensureAuthenticated, (req, res) => {
  res.render('users/blog-new', {
    name: req.user.name,
    username: req.user.username,
    id: req.user.id,
    email: req.user.email
  });
});

// Blog App - POST create new blog post
router.post('/blog', ensureAuthenticated, upload.any('image'), async (req, res) => {
  console.log(req.file)
  const userId = req.user._id;
  const username = req.user.username;
  const { title, body, author } = req.body;
  let errors = [];

  if (!title || !body) {
    errors.push({ msg: 'Please make sure to press the submit button' });
  }

  if (errors.length > 0) {
    req.flash('error_msg', 'Please press submit')
    res.redirect('/users/blog');
  } else {
    try {
      const blogPost = new BlogPost({ title: title, body: body, userId: userId })
      await blogPost.save();
      console.log(`New Blog Post: "${title}", made by "${userId}"`)

      req.flash('success_msg', 'Todo Added!');
      res.redirect('/users/blog');
    } catch (err) {
      console.log(err)
      res.redirect('users/blog');
    }
  }

});




// Portfolio App ------------------------------------------------------
// Portfolio App - GET portfolio page
router.get('/portfolio', ensureAuthenticated, (req, res) => {
  res.render('users/portfolio', { name: req.user.name });
});



// Todo App - GET todo page
router.get('/todo', ensureAuthenticated, (req, res) => {
  console.log(`${req.user.username} access TODO PAGE`)
  const userId = req.user.id
  TodoTask.find({ userId: userId }, (err, tasks) => {
    res.render('users/todo', {
      todoTasks: tasks,
      name: req.user.name,
      username: req.user.username,
      id: req.user._id,
      email: req.user.email
    });
  })
});


// Todo App - POST add new todo
router.post('/todo', ensureAuthenticated, async (req, res) => {
  const userId = req.user._id;
  const { content } = req.body;
  let errors = [];

  if (!content) {
    errors.push({ msg: 'Please make sure to press the submit button' });
  }

  if (errors.length > 0) {
    req.flash('error_msg', 'Please press submit')
    res.redirect('/users/todo');
  } else {
    try {
      const todoTask = new TodoTask({ content: content, userId: userId })
      await todoTask.save();
      console.log(`New todo: "${content}", made by "${userId}"`)

      req.flash('success_msg', 'Todo Added!');
      res.redirect('/users/todo');
    } catch (err) {
      console.log(err)
      res.redirect('users/todo');
    }
  }
});


// Todo App - Delete todo
router.route('/todo/remove/:id').get((req, res) => {
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

// User Profile
router.get('/My-Account', (req, res) => {
  res.render('users/My-Account', {
    name: req.user.name,
    username: req.user.username,
    id: req.user._id,
    email: req.user.email
  });
});


router.get('/youtube', (req, res) => {
  const oauth2client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
  )

  const loginLink = oauth2client.generateAuthUrl({
    access_type: 'offline',
    scope: CONFIG.oauth2Credentials.scopes
  })
  if (!req.cookies.jwt) {
    return res.render('users/youtube', { loginLink: loginLink })
  }
  oauth2client.credentials = jwt.verify(req.cookies.jwt, CONFIG.JWTsecret);

  // Call the youtube api
  const service = google.youtube('v3');

  // Get user subscription list
  service.subscriptions.list({
    auth: oauth2client,
    mine: true,
    part: "snippet,contentDetails",
    maxResults: 50
  }).then((response) => {
    console.log(response)

    return res.render('users/youtube', { loginLink: loginLink })
    // return res.render('users/subscriptions', { subscriptions: response.data.items })
  })

})

router.get('/subscription_list', (req, res) => {
  if (!req.cookies.jwt) {
    return res.redirect('/users/youtube');
  }

  const oauth2client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
  )
  oauth2client.credentials = jwt.verify(req.cookies.jwt, CONFIG.JWTsecret);

  // Call the youtube api
  const service = google.youtube('v3');

  // Get user subscription list
  service.subscriptions.list({
    auth: oauth2client,
    mine: true,
    part: "snippet,contentDetails",
    maxResults: 50
  }).then((response) => {
    console.log(response)

    return res.render('users/subscriptions', { subscriptions: response.data.items })
  })
})

module.exports = router;