const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  passwordResetToken: String,
  passwordResetTokenExpiry: Date,
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be more than 20 characters']
  },
  friends: [{ type: Schema.Types.ObjectId }],
  Date: {
    type: Date,
    default: Date.now
  },
  images: [{
    type: String
  }],
  avatar: {
    type: String
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like'
    }
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Follow'
    }
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Follow'
    }
  ],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Notification'
    }
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  trash: {
    type: String
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters']
  }
}, { collection: 'users' })

const User = mongoose.model('User', UserSchema)

module.exports = User
