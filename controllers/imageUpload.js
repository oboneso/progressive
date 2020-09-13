/**
 * LOAD DEPENDENCIES
 */
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

/**
 * INITIALIZE S3 CONNECTION
 */
const s3 = new aws.S3();

/**
 * S3 ACCESS CREDENTIALS
 */
aws.config.update({
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: "us-east-2"
})

/**
 * VALIDATE FILE TYPE
 */
// const fileFilter = (req, res, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type, only JPEG and PNG files are allowed!'), false);
//   }
// };

/**
 * SETUP MULTER TO PROCESS IMAGE AND SEND IT TO S3 BUCKET
 */
const upload = multer({
  // fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: 'progessive-uploads',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'image' });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

module.exports = upload;