const express = require('express');
const { ensureAuthenticated } = require('../config/auth')

const router = express.Router();

router.get('/', (req, res) => res.render('welcome'));



module.exports = router;