module.exports = {

  function flashSetup(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next()
},

function setUser(req, res, next) {
  const userId = req.body.userId;
  if (userId) {
    req.user = users.find(user => user.id === userId)
  }
  next()
}
}
