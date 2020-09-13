module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    };
    req.flash('error_msg', 'You must be logged in to view this page');
    console.log('isAuthenticated: false')
    return res.redirect('/login');
  }
}

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
console.log('This is from the ensureAuthenticated page');
console.log('<-------------- CURRENT USER req.session INFO ----------->')
console.log(req.session)
console.log('<------------------------- BLOCK END--------------------->')
console.log('<------------------ CURRENT USER DATA ----------------->')
console.log('isAthenticated: true')
console.log(`"isAuthenticated: true ${req.user}`)
console.log('<------------------------ BLOCK END--------------------->')
 *
 */







