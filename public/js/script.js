console.log('main js file loaded')

// console.log('script file connected')
// const modal = document.querySelector('.modal')
// const previews = document.querySelectorAll('img')
// const original = document.querySelector('.full-img')
// const imgText = document.querySelector('.caption')
// previews.forEach((preview) => {
//   preview.addEventListener('click', () => {
//     modal.classList.add('.open')
//     console.log(preview)
//   })
// })

// modal.addEventListener('click', (e) => {
//   console.log(e)
// })
// // Dynamic page headers

// const updateTitle = () => {
//   const url = (document.documentURI.split('/')[4]).toUpperCase()
//   const urlDiv = document.getElementById('url-div')

//   // Set and display current page text
//   urlDiv.innerText = url
//   console.log(url)

//   // TODO: access req.body.name to personalize welcome message
//   // Change back button on dashboard
//   if (url === 'DASHBOARD') {
//     const updateHeaderText = document.getElementById('header-backBtn')
//     updateHeaderText.innerText = 'Welcome!'
//   }
//   if (url === 'PROFILE') {
//     const updateHeaderText = document.getElementById('header-profileBtn')
//     updateHeaderText.innerText = ''
//     updateHeaderText.classList.remove('nav-link')
//   }
// }

// function getActiveDateString () {
//   var e = new Date
//   return activeDateStringForDate(e)
// }

// function activeDateStringForDate (e) {
//   var t = new Date(e)
//   t.getHours() < 5 && (t = new Date(t.getTime() - 864e5))
//   var i = t.getFullYear().toString() + '-' + twoDigit(t.getMonth() + 1) + '-' + twoDigit(t.getDate())
//   return i
// }
