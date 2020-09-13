// yarn add transloadit || npm i transloadit --save-exact
const Transloadit = require('transloadit')

const transloadit = new Transloadit({
  authKey: '7631a19bdc9e4b11b924c911a5123723',
  authSecret: '12704e12bd7d11b1d10d829405aa6cf6059baebc'
})

// Set Encoding Instructions
const options = {
  params: {
    template_id: '343666515ad94454b3e97af63002ba6f',
  }
}

// These Instructions do not require uploads, otherwise:
// transloadit.addFile('myfile_1', './lolcat.jpg')

// Start the Assembly
transloadit.createAssembly(options, (err, result) => {
  if (err) {
    throw err
  }

  console.log({ result })
})



{
  "steps": {
    "files": {
      "robot": "/file/filter",
        "accepts": [
          [
            "${file.mime}",
            "regex",
            "image"
          ]
        ],
          "error_on_decline": true
    },
    "medium": {
      "use": ":original",
        "robot": "/image/resize",
          "width": 300,
            "height": 200,
              "resize_strategy": "fit"
    },
    "large": {
      "use": ":original",
        "robot": "/image/resize",
          "width": 480,
            "height": 320,
              "resize_strategy": "fit"
    },
    "thumbnail": {
      "use": ":original",
        "robot": "/image/resize",
          "width": 80,
            "height": 80,
              "resize_strategy": "crop"
    },
    "export": {
      "use": [
        "medium",
        "large",
        "thumbnail"
      ],
        "robot": "/s3/store",
          "path": "users/profiles/${fields.username}_${previous_step.name}.${file.ext}",
            "key": "YOUR-S3-AUTH-KEY",
              "secret": "YOUR-S3-AUTH-SECRET",
                "bucket": "YOUR-BUCKET-NAME"
    }
  }
}

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: mongoose.Schema.Types.Mixed, required: false }
});
user.avatar = {
  thumbnail: 'http://your.bucket.name.aws.amazon.com/user/profile/bob_thumbnail.jpg',
  medium: 'http://your.bucket.name.aws.amazon.com/user/profile/bob_medium.jpg',
  large: 'http://your.bucket.name.aws.amazon.com/user/profile/bob_large.jpg'
};