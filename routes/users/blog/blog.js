// const bodyParser = require('body-parser')
// const passport = require('passport');
// const express = require('express');

// const { ensureAuthenticated } = require('../../config/auth')
// const BlogPost = require('../../models/Blog')
// const User = require('../../models/User');

// const router = express.Router()


// router.get('/blog', (req, res) => {
//   console.log(req)
//   const userId = req.user.id
//   console.log(`${userId} from blog`)
//   blogPost.find({ userId: userId }, (err, posts) => {
//     res.render('users/blog', {
//       blogPost: posts,
//       name: req.user.name,
//       username: req.user.username,
//       id: req.user._id,
//       email: req.user.email,
//       date: req.body.date
//     });
//   })
// });

// router.get('/blog-new', ensureAuthenticated, (req, res) => {
//   res.render('users/blog-new', {
//     name: req.user.name,
//     username: req.user.username,
//     id: req.user.id,
//     email: req.user.email
//   });
// })


// Blog App - POST create new blog post
// router.post('/blog', ensureAuthenticated, async (req, res) => {
//   console.log(req.file)
//   const userId = req.user._id;
//   const username = req.user.username;
//   const { title, body, author } = req.body;
//   let errors = [];

//   if (!title || !body) {
//     errors.push({ msg: 'Please make sure to press the submit button' });
//   }

//   if (errors.length > 0) {
//     req.flash('error_msg', 'Please press submit')
//     res.redirect('/users/blog');
//   } else {
//     try {
//       const blogPost = new BlogPost({ title: title, body: body, userId: userId })
//       await blogPost.save();
//       console.log(`New Blog Post: "${title}", made by "${userId}"`)

//       req.flash('success_msg', 'Todo Added!');
//       res.redirect('/users/blog');
//     } catch (err) {
//       console.log(err)
//       res.redirect('users/blog');
//     }
//   }
// });

// module.exports = router;