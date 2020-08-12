// Portfolio App ------------------------------------------------------
// Portfolio App - GET portfolio page
router.get('/portfolio', ensureAuthenticated, (req, res) => {
  res.render('users/portfolio', { name: req.user.name });
});
