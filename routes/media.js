const multerS3 = require('multer-s3')
const express = require('express')
const multer = require('multer')
const aws = require('aws-sdk')

const { ensureAuthenticated } = require('../config/auth')
const User = require('../models/User')

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

const router = express.Router()

router.get('/', ensureAuthenticated, (req, res, next) => {
  const images = req.user.images
  const fullSizeImages = req.user.images
  console.log(fullSizeImages)
  res.render('users/photos', ({ images, fullSizeImages }))
})

router.post('/', ensureAuthenticated, upload.single('image'), (req, res, next) => {
  const image = req.file.location
  const userId = req.user.id

  try {
    User.findByIdAndUpdate({ _id: userId },
      { $push: { images: image } }, (err, success) => {
        if (err) {
          console.log(err)
        } else {
          console.log(success)
        }
      })
    res.redirect('/media')
  } catch (err) {
    console.log(err)
  } finally {
    res.redirect('/media')
  }
})

module.exports = router
