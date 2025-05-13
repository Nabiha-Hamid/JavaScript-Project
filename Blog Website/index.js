const createbutton = document.getElementById('createButton');
const PostButton = document.getElementById('postButton');
const postcontainer = document.getElementById('showPost');

if (createbutton) {
  createbutton.addEventListener('click', function (event) {
    event.preventDefault();
    const blogPost = localStorage.getItem('blogPosts');
    let BlogArray = blogPost ? JSON.parse(blogPost) : [];
    const blogPostInput = document.getElementById('blogText');
    const blogTitle = document.getElementById('blogTitle')
    let postId;
    if (BlogArray.length > 0) {
      let blogpost = BlogArray[BlogArray.length - 1]
      postId = blogpost.id + 1;
    }
    else {
      postId = 1;
    }
    if (blogPostInput) {
      const val = blogPostInput.value;
      if (blogPostInput) {
        const newBlog = {
          id: postId,
          title: blogTitle.value,
          text: blogPostInput.value,
          createdAt: Date.now()

        };

        BlogArray.push(newBlog)
        localStorage.setItem('blogPosts', JSON.stringify(BlogArray));
        console.log("the new post is saved in the local storage", newBlog);
      }

    } else {
      console.error('text not found');
    }
  });
} else {
  console.error('Button not found');
}
if (PostButton) {
  postButton.addEventListener('click', function (event) {
    event.preventDefault();

    const blogPost = localStorage.getItem('blogPosts');
    let BlogArray = blogPost ? JSON.parse(blogPost) : [];
    if (BlogArray.length > 0) {
      BlogArray.forEach(post => {
        const postDiv = document.createElement('div')
        postDiv.classList.add('postBlog');
        const postHTML = `
            <p>${post.title}</p>
            <p>${post.text}</p>
            <p class ="post-meta">${new Date(post.createdAt).toLocaleDateString()} at ${new Date(post.createdAt).toLocaleTimeString()}</p>            `;
        postDiv.innerHTML = postHTML;
        postcontainer.appendChild(postDiv)
      });
    }
    else {
      postcontainer.innerHTML = '<p>There were no posts </p>'
      console.log("the post was not there ");

    }
  });
}
else {
  postcontainer.innerHTML = '<p>There were no posts found in the local storage </p>'

}
function performSearch() {
  const query = searchInput.value.trim().toLowerCase();
  searchResultsContainer.innerHTML = '';
  const storedPosts = localStorage.getItem('blogPosts');
  if (storedPosts) {
    const BlogArray = JSON.parse(storedPosts);
    const searchResults = BlogArray.filter(post => {
      const title = post.title ? post.title.toLowerCase() : '';
      const content = post.text ? post.text.toLowerCase() : '';
      return title.includes(query) || content.includes(query);
    });

    if (searchResults.length > 0) {
      searchResults.forEach(post => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('search-result-item');
        const title = post.title || 'No Title';
        const excerpt = post.text ? post.text.substring(0, 100) + '...' : '';
        resultDiv.innerHTML = `
          <h3>${title}</h3>
          <p>${excerpt}</p>
          <button class="view-button" data-post-id="${post.id}">View Full Post</button>
          <hr>
        `;
        searchResultsContainer.appendChild(resultDiv);
      });

      // Add event listeners to the "View Full Post" buttons in search results
      const viewButtons = searchResultsContainer.querySelectorAll('.view-button');
      viewButtons.forEach(button => {
        button.addEventListener('click', function () {
          const postId = this.dataset.postId;
          displaySinglePost(postId);
        });
      });

    } else {
      searchResultsContainer.innerHTML = '<p>No matching blogs found.</p>';
    }
  } else {
    searchResultsContainer.innerHTML = '<p>No blogs available to search.</p>';
  }
}


const allpostButton = document.getElementById('allPost')
// allpostButton.addEventListener('click', function () { localStorage.clear() });
allpostButton.addEventListener('click', function () {
  const postcontainers = document.getElementById("allp");

  if (!postcontainers) {
    console.log("the container was not found");
    return;
  }

  const blogPost = localStorage.getItem('blogPosts');
  let BlogArray = blogPost ? JSON.parse(blogPost) : [];
  if (BlogArray.length > 0) {
    const placeholderImageUrl = "BlogImage.png"
    BlogArray.forEach(post => {
      const postDiv = document.createElement('div')
      postDiv.classList.add('postBlog');
      postDiv.dataset.id = post.id;
      const postHTML = `

              <img src="${placeholderImageUrl}" alt="Placeholder Image" class="card-image">
                <p>${post.title}</p>
        <p class ="post-meta">${new Date(post.createdAt).toLocaleDateString()} at ${new Date(post.createdAt).toLocaleTimeString()}</p>
          <button
              class="delete-button"
              data-post-id="${post.id}"
              style="background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-size: 1em;"
            >Delete Button</button>

         `;
      postDiv.innerHTML = postHTML;
      postcontainers.appendChild(postDiv)
    });
    postcontainers.addEventListener('click', function (event) {
      if (event.target && event.target.classList.contains('delete-button')) {
        const postId = Number(event.target.dataset.postId);
        DeletePost(postId);

      }
    });


    postcontainers.addEventListener('click', function (event) {
      const clickedCard = event.target.closest('.postBlog')
      if (clickedCard) {
        const pid = clickedCard.dataset.id
        if (pid) {
          const requiredPost = BlogArray.find(post => post.id = pid)
          console.log(requiredPost.id)
          console.log(requiredPost.title)
          CompletePost(requiredPost)
        }
        else {
          console.log("no id found")
        }
      }
      else {
        console.log("no card found")
      }
    });
  }
  else {
    postcontainers.innerHTML = '<p>There were no posts </p>'
    console.log("the post was not there ");

  }
});
const complete = document.getElementById('completePost')

function CompletePost(post) {
  const placeholderImageUrl = "BlogImage.png"
  complete.innerHTML = ''
  const postDiv = document.createElement('div')
  postDiv.classList.add('postBlogs');
  postDiv.dataset.id = post.id;
  const postHTML = `

              <img src="${placeholderImageUrl}" alt="Placeholder Image" class="card-image">
                <p>${post.title}</p>
                <p>${post.text}</p>
        <p class ="post-meta">${new Date(post.createdAt).toLocaleDateString()} at ${new Date(post.createdAt).toLocaleTimeString()}</p>


         `;
  postDiv.innerHTML = postHTML;
  complete.appendChild(postDiv)
}
function DeletePost(id) {
  console.log("this is the id", id)
  const blogPost = localStorage.getItem('blogPosts');
  if (!blogPost) {
    console.log("No posts in localStorage");
    return;
  }

  let BlogArray = JSON.parse(blogPost);
  if (!Array.isArray(BlogArray)) {
    console.error("Stored data is not an array");
    return;
  }

  BlogArray = BlogArray.filter(post => post.id !== id);

  console.log(`Post with ID ${id} deleted`);
  localStorage.setItem('blogPosts', JSON.stringify(BlogArray));
}

// const allposts = document.getElementByIdC(allp)

