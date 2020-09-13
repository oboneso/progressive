const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const FollowSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timesstamps: true,
  }
)

module.exports = mongoose.model('Follow', FollowSchema)