const Blog = require("../models/Blog")

exports.deletePost = async (id) => {
  await Blog.findOneandDelete(id, (err, doc) => {
    if (err) {
      return (err)
    }
    if (doc) {
      return doc
    }
  })
}