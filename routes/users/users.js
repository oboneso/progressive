const bodyParser = require('body-parser')
const passport = require('passport');
const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const LoginLogoutTracker = require('../../models/LoginLogoutTracker');
const { ensureAuthenticated } = require('../../config/auth')
const User = require('../../models/User');
const BlogPost = require('../../models/Blog');
const TodoTask = require('../../models/TodoTask')
// Youtube 
const CONFIG = require('../../config');
const google = require('googleapis').google;
const jwt = require('jsonwebtoken');
const OAuth2 = google.auth.OAuth2;
const cookieParser = require("cookie-parser");
const router = express.Router();

/** ------------------------------------------------------------------------ 
*     @ GET LOGIN PAGE
*     @ APP/user/login
* ------------------------------------------------------------------------ */
router.get('/login', (req, res) => {
  res.render('users/login');
});
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ GET MEMORY GAME
*     @ APP/user/memory-game
* ------------------------------------------------------------------------ */
router.get('/memory-game', (req, res) => {
  res.render('users/memory-game');
});
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ GET MEMORY GAME 2
*     @ APP/user/memory-game-2
* ------------------------------------------------------------------------ */
router.get('/memory-game-2', (req, res) => {
  res.render('users/memory-game-2');
});
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ GET CODE EXERCISES
*     @ APP/user/code-exercises
* ------------------------------------------------------------------------ */
router.get('/code-exercises', (req, res) => {
  res.render('users/code-exercises');
});
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ POST CODE EXERCISES
*     @ APP/user/code-exercises
* ------------------------------------------------------------------------ */
router.post('/code-exercises', ensureAuthenticated, async (req, res) => {
  const userId = req.user._id;
  const username = req.user.username;
  const { title, body, author } = req.body;
  let errors = [];

  if (!title || !body) {
    errors.push({ msg: 'Please make sure to press the submit button' });
  }

  if (errors.length > 0) {
    req.flash('error_msg', 'Please press submit')
    res.redirect('/users/code-exercises');
  } else {
    try {
      const javascriptArticle = new JavaScriptArticle({ category: category, title: title, body: body, userId: userId })
      await javascriptArticle.save();
      console.log(`New JS Article: "${title}", made by "${userId}"`)

      req.flash('success_msg', 'Todo Added!');
      res.redirect('users/code-exercises');
    } catch (err) {
      console.log(err)
      res.redirect('users/code-exercises');
    }
  }
});

/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ POST LOGIN ATTEMPT
*     @ APP/user/login
* ------------------------------------------------------------------------ */
router.get('/code-exercises/is-valid-password', (req, res) => {
  res.render('users/is-valid-password');
});
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ POST LOGIN ATTEMPT
*     @ APP/user/login
* ------------------------------------------------------------------------ */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ GET BLOG PAGE
*     @ APP/user/blog
* ------------------------------------------------------------------------ */
router.get('/blog', (req, res) => {

  const userId = req.user.id
  console.log(`${userId} from blog`)
  BlogPost.find({ userId: userId }).sort({ date: -1 }).exec((err, posts) => {

    res.render('users/blog', {
      blogPost: posts,
      name: req.user.name,
      username: req.user.username,
      id: req.user._id,
      email: req.user.email,
      date: req.body.date,
      moment: moment
    });
  })
});
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ GET NEW BLOG POSTS
*     @ APP/user/blog-new
* ------------------------------------------------------------------------ */
router.get('/blog-new', ensureAuthenticated, (req, res) => {
  const userId = req.user.id
  console.log(`GET /users/blog-new: accessed by ${userId}`)

  res.render('users/blog-new', {
    name: req.user.name,
    username: req.user.username,
    id: req.user._id,
    email: req.user.email
  });
})
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ POST NEW BLOG POST
*     @ APP/user/blog
* ------------------------------------------------------------------------ */
router.post('/blog-new', (req, res) => {
  const userId = req.user._id;
  const { title, body, username } = req.body;
  let errors = [];
  if (!title || !body) {
    errors.push({ msg: 'Please make sure to press the submit button' });
  }
  if (errors.length > 0) {
    req.flash('error_msg', 'Please press submit')
    res.redirect('/users/blog');
  } else {
    try {
      const blogPost = new BlogPost({ title, body, username, userId })
      blogPost.save();
      req.flash('success_msg', 'Todo Added!');
      res.redirect('/users/blog');
    } catch (err) {
      console.log(err)
      res.redirect('users/blog');
    }
  }
});
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ GET JS-EXERCISES
*     @ APP/user/friends
* ------------------------------------------------------------------------ */
router.get('/js-exercises', (req, res) => {
  res.render('users/')
});
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ GET FRIENDS
*     @ APP/user/friends
* ------------------------------------------------------------------------ */
router.get('/friends', (req, res) => {

  User.find({}, (err, users) => {

    let userEmail = [];
    let userName = [];
    let userDate = [];

    users.forEach(user => {
      let { name, email, Date } = user;
      console.log(name, email, Date)

      if (email === undefined) {
        email = 'User does not have an email';
      }

      userEmail.push(email);
      userName.push(name)
      userDate.push(Date)
    });

    console.log(userName, userEmail, userDate)
    res.render('users/friends', { userName, userEmail, userDate })

  });
});
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ GET MAIN DASHBOARD
*     @ APP/user/dashboard
* ------------------------------------------------------------------------ */
router.get('/dashboard', ensureAuthenticated, async (req, res, next) => {
  const userId = req.user._id;
  const name = req.user.name;
  const username = req.user.username;
  try {
    // Create new login tracker
    const tracker = new LoginLogoutTracker({ userId, name, username, login: true, logout: false })
    await tracker.save();
  } catch (err) {
    // Handle errors
    console.log(err)
    res.render('users/dashboard');
  }
  // Render dashboard view
  res.render('users/dashboard')
});
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ POST NEW REGISTRATION DATA
*     @ APP/user/register
* ------------------------------------------------------------------------ */
router.get('/register', (req, res) => {
  res.render('users/register');
});
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ POST NEW REGISTRATION DATA
*     @ APP/user/register
* ------------------------------------------------------------------------ */
router.post('/register', (req, res) => {
  // Save user data to variables
  const { name, username, email, password, password2 } = req.body;
  // Initialize errors array for validation handling
  let errors = [];
  // Check for empty user inputs
  if (!name || !username || !email || !password || !password2) {
    // If any field is missing, add msg object to errors array
    errors.push({ msg: 'All fields are required' });
  }
  // Check password min. length
  if (password.length < 6) {
    errors.push({ msg: 'Password must be a minimum of 6 characters' });
  }
  // Check password equality
  if (password !== password2) {
    errors.push({ msg: 'Passwords must match' });
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
          // If no errors, create new user
          const newUser = new User({
            name,
            username,
            email,
            password
          });
          // Hash password for encrypted db storage
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
/** ------------------------------------------------------------------------ */


/** ------------------------------------------------------------------------ 
*     @ LOGOUT
*     @ APP/user/logout
* ------------------------------------------------------------------------ */
router.get('/logout', ensureAuthenticated, async (req, res) => {
  // TODO - add feature for user IP address
  const userId = req.user._id;
  const name = req.user.name;
  const username = req.user.username;
  try {
    // Initiate logout tracker
    const tracker = new LoginLogoutTracker({ userId, name, username, login: true, logout: false })
    await tracker.save();
  } catch (err) {
    console.log(err)
    res.render('users/dashboard');
  }
  // Log user out
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});
/** ------------------------------------------------------------------------ */



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