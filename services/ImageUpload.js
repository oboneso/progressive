const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const express = require('express');

aws.config.update({
  region: 'us-east-2'
})

const s3 = new aws.S3({});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'keithmacdonald-portfolio-media',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'TESTING_META_DATA' });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

module.exports = upload;