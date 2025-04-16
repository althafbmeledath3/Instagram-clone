// console.log(localStorage.getItem('token'))

let posts = document.getElementById('posts');
let str = "";

//username
let username = document.getElementById('username');
let profile_pic = document.getElementById('profile_pic');

async function loadPosts() {
  try {
    const response = await fetch("http://localhost:4000/api/loadPosts", {
      headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
    });

    console.log(response);
    const data = await response.json();
    console.log(data);

    if (response.status === 200) {
      // set the id on localstorage
      localStorage.setItem('id', data.userData._id);
      // localStorage.setItem('profile', data.userData.profile_pic)

      // generate posts
      data.data.forEach(element => {
        str += `
        <div class="post-section">
          <div class="post-header">
            <img src=${element.profile_pic} alt="User" />
            <strong>${element.username}</strong>
          </div>
          <img class="post-image" src=${element.post} alt="Post Image" />
          
          <!-- ❤️ SVG Heart Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               width="33" height="33"
               class="heart-icon loveIcon"
               stroke="red"
               stroke-width="2"
               fill="none"
               stroke-linecap="round"
               stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 
            7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>

          <a class="comment-btn">💬</a>
          <a class="share-btn">⤴</a>
          <div class="post-description">
            ${element.description}
          </div>
        </div>`;
      });

      // update DOM
      profile_pic.src = data.userData.profile_pic;
      posts.innerHTML = str;
      username.textContent = `Welcome ${data.userData.username}`;

      // handle heart icon toggles
      const loveIcons = document.querySelectorAll(".loveIcon");

      loveIcons.forEach(icon => {
        let isFilled = false;

        icon.addEventListener("click", () => {
          isFilled = !isFilled;
          if (isFilled) {
            icon.setAttribute("fill", "red");
            icon.classList.add("beat");
          } else {
            icon.setAttribute("fill", "none");
            icon.classList.remove("beat");
          }
        });
      });
    }

    else if (response.status === 403) {
      window.location.href = "/login.html";
    }

  } catch (err) {
    console.log(err);
  }
}

loadPosts();

// signout function
function signout() {
  alert("Signing Out");
  localStorage.removeItem("id");
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}
