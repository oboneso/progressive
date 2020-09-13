const express = require('express');
const bcrypt = require('bcryptjs');

const LoginLogoutTracker = require('../../models/LoginLogoutTracker');
const JavaScriptArticle = require('../../models/JavaScriptArticle')
const { ensureAuthenticated } = require('../../config/auth');
const TodoTask = require('../../models/TodoTask')
const User = require('../../models/User');

// Youtube 
const CONFIG = require('../../config');
const google = require('googleapis').google;
const jwt = require('jsonwebtoken');
const OAuth2 = google.auth.OAuth2;
const cookieParser = require("cookie-parser");
const router = express.Router();

// upload images
const upload = require('../../controllers/imageUpload')
const singleUpload = upload.single('image')

router.get('/memory-game', (req, res) => {
  res.render('users/memory-game');
});

router.get('/memory-game-2', (req, res) => {
  res.render('users/memory-game-2');
});

router.get('/code-exercises', (req, res) => {
  res.render('users/code-exercises');
});

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
      const javascriptArticle = new JavaScriptArticle({ category: category, title: title, body: body, userId: userId });
      await javascriptArticle.save();
      console.log(`New JS Article: "${title}", made by "${userId}"`);

      req.flash('success_msg', 'Todo Added!');
      res.redirect('users/code-exercises');
    } catch (err) {
      console.log(err);
      res.redirect('users/code-exercises');
    }
  }
});

router.get('/code-exercises/is-valid-password', (req, res) => {
  res.render('users/is-valid-password');
});


router.get('/js-exercises', (req, res) => {
  res.render('users/')
});

router.get('/friends', ensureAuthenticated, async (req, res, next) => {
  const friends = req.user.friends;
  const id = req.user.id;
  console.log(friends)
  try {
    await User.find({}, (err, users) => {
      if (err) {
        throw new (err);
      }
      const userEmail = [];
      const userName = [];
      const userDate = [];
      const userId = [];
      const userFriends = [];
      users.forEach(user => {
        let { name, email, Date, _id, friends } = user;

        // console.log(name, email, Date, _id)

        if (email === undefined) {
          email = 'User does not have an email';
        }

        userEmail.push(email);
        userName.push(name);
        userDate.push(Date);
        userId.push(_id);
        userFriends.push(friends)
      });
      console.log(`This is the current signed in users friends ${friends}`)

      res.render('users/friends',
        {
          userName,
          userEmail,
          userDate,
          userId,
          userFriends,
          id,
          friends
        }
      )
    });
  } catch (err) {
    next(err);
  };
});

router.get('/friends/:id', async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      { _id: req.user.id },
      { $push: { friends: req.params.id } },
      { new: true },
      (err, user) => {
        if (err || !user) {
          return next(
            new ErrorResponse(
              `Something went wrong ${err}`, 404)
          );
        } else {
          console.log(user);
        };
        res.redirect("/users/friends");
      })
  } catch (err) {
    next(err)
  }
})




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


// GET - APP/users/login
router.get('/my-account', (req, res) => {
  res.render('users/my-account', {
    name: req.user.name,
    username: req.user.username,
    id: req.user._id,
    email: req.user.email
  });
});
// router.get('/photos', (req, res) => {
//   res.render('users/photos', {
//     name: req.user.name,
//     username: req.user.username,
//     id: req.user._id,
//     email: req.user.email
//   });
// });

// router.post('/photos', (req, res) => {
//   const uid = req.params.id;

// singleUpload(req, res, function (err) {
//   if (err) {
//     return res.json({
//       success: false,
//       errors: {
//         title: "Image Upload Error",
//         detail: err.message,
//         error: err,
//       },
//     });
//   }
// })
// });

module.exports = router;