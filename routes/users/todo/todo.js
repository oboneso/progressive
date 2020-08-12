const express = require('express');

// Todo App - GET todo page
router.get('/todo', ensureAuthenticated, (req, res) => {
  console.log(`${req.user.username} access TODO PAGE`)
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
});


// Todo App - POST add new todo
router.post('/todo', ensureAuthenticated, async (req, res) => {
  const userId = req.user._id;
  const { content } = req.body;
  let errors = [];

  if (!content) {
    errors.push({ msg: 'Please make sure to press the submit button' });
  }

  if (errors.length > 0) {
    req.flash('error_msg', 'Please press submit')
    res.redirect('/users/todo');
  } else {
    try {
      const todoTask = new TodoTask({ content: content, userId: userId })
      await todoTask.save();
      console.log(`New todo: "${content}", made by "${userId}"`)

      req.flash('success_msg', 'Todo Added!');
      res.redirect('/users/todo');
    } catch (err) {
      console.log(err)
      res.redirect('users/todo');
    }
  }
});


// Todo App - Delete todo
router.route('/todo/remove/:id').get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, err => {
    if (err) {
      return res.send(500, err);
      res.redirect('/users/todo')
    }
    req.flash('sucess_msg', 'Todo removed!');
    res.redirect('/users/todo')
  });
});