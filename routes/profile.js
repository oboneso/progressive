const multerS3 = require('multer-s3')
const express = require('express')
const multer = require('multer')
const aws = require('aws-sdk')
// const LoginLogoutTracker = require('../models/LoginLogoutTracker')
const { ensureAuthenticated } = require('../config/auth')
// const { UserRefreshClient } = require('google-auth-library')
const User = require('../models/User')

const router = express.Router()

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

// GET - APP/users/login
router.get('/', ensureAuthenticated, (req, res, next) => {
  console.log(`This is the req.user.avatar ${req.user.avatar}`)
  res.render('users/profile', {
    name: req.user.name,
    username: req.user.username,
    id: req.user._id,
    email: req.user.email,
    avatar: req.user.avatar
  })
})

router.post('/', ensureAuthenticated, upload.single('image'), (req, res, next) => {
  const avatar = req.file.location
  User.findByIdAndUpdate(req.user.id, {
    avatar: avatar
  }).exec((err, data) => {
    if (err) throw (err)
    console.log(`This is the returned data ${data}`)
    res.redirect('/profile')
  })
})

module.exports = router
