const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/User')

const JavaScriptArticleSchema = new Schema({
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JavaScriptArticle', JavaScriptArticleSchema);
