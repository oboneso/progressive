const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/User')

const todoTaskSchema = Schema({
  content: {
    type: String,
    required: true
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

module.exports = mongoose.model('TodoTask', todoTaskSchema);