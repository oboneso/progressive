const ErrorResponse = require('../utils/errorResponse')
const Blog = require('../models/Blog')
const moment = require('moment')
const Trash = require('../models/Trash')
const methodOverride = require('method-override')
const Photo = require('../models/Photo')
const multerS3 = require('multer-s3')
const multer = require('multer')
const aws = require('aws-sdk')

aws.config.update({
  secretAccessKey: '7WagWVP1mGXEEkuKbbiFHADaxalXivu4hY//kCOH',
  accessKeyId: 'AKIAIFJT4SCVA4RQTLKA',
  region: 'us-east-2'
})

const s3 = new aws.S3()

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'progressive-uploads',
    acl: 'public-read',
    key: function (req, file, cb) {
      const fullPath = `${file.fieldname}/${req.user.id}/${Date.now().toString()}/${file.originalname}`
      cb(null, fullPath)
    }
  })
})

// @desc
//  @route GET /blog
//  @access PRIVATE
exports.getBlogPosts = async (req, res, next) => {
  const userId = req.user.id
  try {
    await Blog.find({ userId: userId }).sort({ date: -1 }).exec((err, posts) => {
      const usablePosts = []
      for (const post of posts) {
        // change mongoose object to usable object
        usablePosts.push(post.toObject())
      }
      for (const post of usablePosts) {
        post.date = (moment(post.date).format('LLL'))
      }

      if (!posts || err) {
        return next(
          new ErrorResponse(`Blog posts not found with id of ${req.params.id}`, 404)
        )
      }
      console.log(usablePosts[0].date)
      console.log(posts[0].date)
      const { image } = posts
      res.render('users/blog', {
        blogPost: usablePosts,
        name: req.user.name,
        username: req.user.username,
        id: req.user._id,
        image: image,
        email: req.user.email,
        date: req.body.date,
        postId: req.body._id,
        moment: moment
      })
    })
  } catch (err) {
    next(err)
  };
}
// change the date format
// usablePost.date = (moment(usablePost.date).format('LL'))
// format object
// const formattedDate = JSON.stringify(usablePost.date)

exports.newBlogPost = (req, res, next) => {
  res.render('users/blog-new', {
    name: req.user.name,
    username: req.user.username,
    id: req.user._id
  })
}
//  @desc   Create new blog post
//  @route  POST /blog
//  @access PRIVATE
exports.createBlogPost = async (req, res, next) => {
  const userId = req.user._id
  const { title, body, username } = req.body
  console.log(req.file)
  const image = req.file.location
  Photo.create({ image, userId }, (err, newPhoto) => {
    console.log(err)
    console.log(`newPhoto: ${newPhoto}`)
  })
  const errors = []
  if (!title || !body) {
    errors.push({ msg: 'Please make sure to press the submit button' })
  }
  if (errors.length > 0) {
    req.flash('error_msg', 'Please press submit')
    return res.redirect('/blog')
  }

  try {
    Blog.create({ title, body, username, image, userId }, (err, newPost) => {
      if (err) {
        return next(
          console.log(err)
          // new ErrorResponse(`Blog post not found with id of ${req.params.id}`, 404)
        )
      }
      req.flash('success_msg', 'Post Added')
      res.redirect('/blog')
    })
  } catch (err) {
    if (err) {
      console.log(err)
    }
    res.redirect('/blog')
  }
}

//  @route GET /blog/:id
//  @access PRIVATE
exports.getBlogPost = async (req, res, next) => {
  try {
    await Blog.findById({ _id: req.params.id }, (err, blogPost) => {
      if (!blogPost || err) {
        return next(
          new ErrorResponse(`Blog post not found with id of ${req.params.id}`, 404)
        )
      }
      res.render('/blog/singleBlog', {
        postId: req.params._id
      })
      // res.status(200).json({ success: true });
    })
  } catch (err) {
    next(err)
  };
}

// @desc    Update blog post
// @route   PUT /blog/:id
// @access  Private
exports.updateBlogPost = async (req, res, next) => {
  const oldBlogPostId = req.params.id
  const { title, body, username } = req.body
  console.log(req.body)
  console.log(req.params)
  const userId = req.user._id

  try {
    await Blog.findByIdAndUpdate(
      oldBlogPostId,
      ({
        title,
        body,
        username,
        userId
      }),
      { new: false },
      (err, blogPost) => {
        console.log(blogPost)
        if (err || !blogPost) {
          return next(
            new ErrorResponse(
                `Something went wrong ${err}`, 404)
          )
        };
        console.log(blogPost)
        const trashItem = new Trash({ title: blogPost, id: req.params.id })
        trashItem.save()
        return res.redirect('/blog')
      })
  } catch (err) {
    next(err)
  };
}

// @desc    Delete blog post
// @route   DELETE /blog/:id
// @access  Private
exports.deleteBlogPost = async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id, (err, data) => {
      if (err) {
        return next(
          new ErrorResponse(`Something went wrong with the delete function ${err}`, 404)
        )
      } else {
        req.flash('deleted_msg', 'Deleted successfully!')
        const trashItem = new Trash({ title: data, id: req.params.id })
        trashItem.save()
        console.log(`((${data} ...Sent to trash.))`)
        return res.redirect('/blog')
      }
    })
  } catch (err) {
    next(err)
  };
}
