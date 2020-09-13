const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('users/exercises1')
})

module.exports = router
