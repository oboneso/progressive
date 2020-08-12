const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/User');

const LoginLogoutTrackerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  login: {
    type: Boolean,
    required: true
  },
  logout: {
    type: Boolean,
    required: true
  },
  createDate: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { collection: 'LoginLogoutTracker' });

const LoginLogoutTracker = mongoose.model('LoginLogoutTracker', LoginLogoutTrackerSchema)

module.exports = LoginLogoutTracker