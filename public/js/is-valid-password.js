
const name = document.getElementById('name').value
const pass = document.getElementById('pass').value
const button = document.getElementById('button');

button.addEventListener('click', (event) => {
  console.log(event)
  event.preventDefault();
  console.log('addEventListener on the button is working!');

})












//   if (password.length >= 8) {
//     if (password.indexOf(' ') === null) {
//       if (!(password === username)) {
//         return true
//       }
//     }
//   }
//   return false;
// }


// function getUserName() {
//   var nameField = document.getElementById('nameField').value;
//   var result = document.getElementById('result');

//   if (nameField.length < 3) {
//     result.textContent = 'Username must contain at least 3 characters';
//     //alert('Username must contain at least 3 characters');
//   } else {
//     result.textContent = 'Your username is: ' + nameField;
//     //alert(nameField);
//   }
// }
// var subButton = document.getElementById('subButton');
// subButton.addEventListener('click', getUserName, false);
