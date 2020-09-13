const express = require('express');
const User = require('../models/User');
const LoginLogoutTracker = require('../models/LoginLogoutTracker');
const { ensureAuthenticated } = require('../config/auth');
const { todo, todoPost, todoDelete } = require('../controllers/todo');

const router = express.Router();

router.route('/').get(ensureAuthenticated, todo);
router.route('/').post(ensureAuthenticated, todoPost);
router.route('/').delete(ensureAuthenticated, todoDelete);

module.exports = router;