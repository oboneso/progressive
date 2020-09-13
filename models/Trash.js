const Blog = require('./Blog');
const User = require('./User');
const mongoose = require('mongoose');
const { modelName } = require('./User');
const Schema = mongoose.Schema;

const TrashSchema = new Schema({
  title: {
    type: String
  },
  body: {
    type: String
  },
  id: {
    type: Schema.Types.ObjectId,
    ref: Blog
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { collection: 'trash' });

const Trash = mongoose.model('Trash', TrashSchema);

module.exports = Trash;