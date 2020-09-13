console.log('Blog Connected')

const allPosts = document.querySelector('.all-posts')
const blogPosts = document.querySelectorAll('.single-blog-post')

// allPosts.addEventListener('click', () => {
//   allPosts.classList.add('hide')
//   console.log('previews clicked')
// })

for (const blogPost of blogPosts) {
  blogPost.addEventListener('click', () => {
    allPosts.classList.add('hide')
    this.classList.remove('hide')
  })
}
