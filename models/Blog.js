const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/User')

const blogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  username: {
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
}, { collection: 'blogs' });


const Blog = mongoose.model('Blog', blogSchema);



module.exports = Blog;