// User Profile
router.get('/My-Account', (req, res) => {
  res.render('users/My-Account', {
    name: req.user.name,
    username: req.user.username,
    id: req.user._id,
    email: req.user.email
  });
});