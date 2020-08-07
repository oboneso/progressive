// Dynamic page headers

const updateTitle = () => {
  const url = (document.documentURI.split('/')[4]).toUpperCase()
  const urlDiv = document.getElementById("url-div")

  // Set and display current page text
  urlDiv.innerText = url
  console.log(url)

  // TODO: access req.body.name to personalize welcome message
  // Change back button on dashboard
  if (url === 'DASHBOARD') {
    const updateHeaderText = document.getElementById('header-backBtn')
    updateHeaderText.innerText = 'Welcome!';
  }
  if (url === 'PROFILE') {
    const updateHeaderText = document.getElementById('header-profileBtn')
    updateHeaderText.innerText = '';
    updateHeaderText.classList.remove('nav-link');
  }
};