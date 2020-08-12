const bodyParser = require('body-parser')
const passport = require('passport');
const express = require('express');

const { ensureAuthenticated } = require('../../config/auth')
const User = require('../../models/User');
const BlogPost = require('../../models/Blog')


// Blog path  APP/users/:userId/blog
// GET all blog posts APP/users/:userId/blog
// POST create new blog post APP/users/:userId/blog/create
// PUT update blog post APP/users/:userId/blog/:blogId/update
// DELETE delele blog post APP/users/:userId/blog/:blogId/delete

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

