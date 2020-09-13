const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/User')

const photoSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  image: [
    {
      type: String,
      required: true
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
}, { collection: 'photos' });


const Photo = mongoose.model('Photo', photoSchema);



module.exports = Photo;