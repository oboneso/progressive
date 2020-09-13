const { ensureAuthenticated } = require('../config/auth')
const ErrorResponse = require('../utils/errorResponse')
const moment = require('moment');
const Trash = require('../models/Trash');
const router = express.Router();
const bodyParser = require('body-parser')
const TodoTask = require('../../models/TodoTask')

exports.todo = (req, res, next) => {
  const userId = req.user.id
  TodoTask.find({ userId: userId }, (err, tasks) => {
    res.render('users/todo', {
      todoTasks: tasks,
      name: req.user.name,
      username: req.user.username,
      id: req.user._id,
      email: req.user.email
    });
  })
}


exports.todoPost = async (req, res, next) => {
  const userId = req.user._id;
  const { content } = req.body;
  let errors = [];
  if (!content) {
    errors.push({ msg: 'Please make sure to press the submit button' });
  }
  if (errors.length > 0) {
    req.flash('error_msg', 'Please press submit')
    res.redirect('/todo');
  } else {
    try {
      const todoTask = await new TodoTask({ content: content, userId: userId })
      todoTask.save();
      console.log(`New todo: "${content}", made by "${userId}"`)

      req.flash('success_msg', 'Todo Added!');
      res.redirect('/todo');
    } catch (err) {
      next(err)
    }
  }
}

exports.todoDelete = async (req, res, next) => {
  const id = req.params.id;
  try {
    await TodoTask.findByIdAndRemove(id, err => {
      if (err) {
        return res.send(500, err);
        res.redirect('/todo')
      }
      req.flash('sucess_msg', 'Todo removed!');
      res.redirect('/todo')
    });
  } catch (err) {
    next(err);
  };
};

