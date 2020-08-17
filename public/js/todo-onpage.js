console.log('Todo Onpage File Connected!!')
const todoInput = document.querySelector('#todo-input');

todoInput.addEventListener('onkeyup', (event) => {
  if (event.keycode === 13) {
    var todoText = todoInput.val();
  }
});
