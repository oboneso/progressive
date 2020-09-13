const express = require('express')
const aws = require('aws-sdk')
const multer = require('multer')
var multerS3 = require('multer-s3')

const { ensureAuthenticated } = require('../config/auth')
const {
  getBlogPosts,
  newBlogPost,
  createBlogPost,
  getBlogPost,
  updateBlogPost,
  deleteBlogPost
} = require('../controllers/blog')

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
      cb(null, Date.now().toString())
    }
  })
})

const router = express.Router()

router.route('/').get(ensureAuthenticated, getBlogPosts)
router.route('/new').get(ensureAuthenticated, newBlogPost)
router.route('/new').post(ensureAuthenticated, upload.single('image'), createBlogPost)
router.route('/:id').get(ensureAuthenticated, getBlogPost)
router.route('/:id').put(ensureAuthenticated, updateBlogPost)
router.route('/:id').delete(ensureAuthenticated, deleteBlogPost)

module.exports = router
