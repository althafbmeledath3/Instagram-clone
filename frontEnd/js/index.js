
// console.log(localStorage.getItem('token'))

import { fetch } from "undici-types";

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

   
   
    const data = await response.json();
    console.log('Fetched data:', data);

    if (response.status === 200) {
      // set the id on localstorage
      localStorage.setItem('id', data.userData._id);

    
      str = '';

      // generate posts
      const reversed = data.data.reverse()

      reversed.forEach((element, index) => {
       
        let images = [];

        if (element.post) {
          images = element.post;
          
        }


        console.log(element.post)
      

        let imagesHtml = '';
       

        // slider calass for image lenght greater than 1

        if (images.length >= 1) {
          imagesHtml = `
            <div class="swiper post-swiper-${index}">
              <div class="swiper-wrapper">
                ${images.map(post => `<div class="swiper-slide"><img class="post-image" src="${post}" alt="Post Image" loading="lazy" /></div>`).join('')}
              </div>
              <div class="swiper-button-prev" aria-label="Previous slide"></div>
              <div class="swiper-button-next" aria-label="Next slide"></div>
              <div class="swiper-pagination"></div>
            </div>`;
        } 

        str += `
        <div class="post-section">
          <div class="post-header">
            <img src="${element.profile_pic}" alt="User" />
            <strong>${element.username}</strong>
          </div>
          <div class="post-images ">${imagesHtml}</div>
          
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


      //display story ring
      const response2 = await fetch("/api/getUsers")

      const data2 = await response2.json()

      console.log(data2)

      // handle heart icon toggles
      
      document.addEventListener('click', (e) => {
        if (e.target.closest('.loveIcon')) {
          const icon = e.target.closest('.loveIcon');
          const isFilled = icon.getAttribute('fill') === 'red';
          if (isFilled) {
            icon.setAttribute('fill', 'none');
            icon.classList.remove('beat');
          } else {
            icon.setAttribute('fill', 'red');
            icon.classList.add('beat');
          }
        }
      });

      
      // add swiper for all iposts with class post-swiper
      const swiperElements = document.querySelectorAll('[class*="post-swiper-"]');
      console.log(`Found ${swiperElements.length} Swiper containers`);
      swiperElements.forEach((swiperEl, i) => {
        console.log(`Initializing Swiper for post-swiper-${i}`);
        new Swiper(`.post-swiper-${i}`, {
          slidesPerView: 1,
          spaceBetween: 10,
          navigation: {
            nextEl: `.post-swiper-${i} .swiper-button-next`,
            prevEl: `.post-swiper-${i} .swiper-button-prev`
          },
          pagination: {
            el: `.post-swiper-${i} .swiper-pagination`,
            clickable: true
          }
        });
      });
    }

    //if no token then login page no access
    else if (response.status === 403) {
     
    
      window.location.href = "/login.html";
    } else {
     
      console.error('Unexpected response status:', response.status);
    }
  } catch (err) {
    console.log(err);
  
    console.error('Error in loadPosts:', err);
  }
}

//load posts function
loadPosts();

// signout function
function signout() {
  alert("Signing Out");
  localStorage.removeItem("id");
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

//upload posts section

let postImages = [];
document.getElementById('post').addEventListener('change', async (e) => {
  postImages = [];
  const files = e.target.files;
  const preview = document.getElementById('preview');
  preview.innerHTML = '';
 
  preview.classList.remove('one', 'two', 'three-or-more');

  if (files.length === 1) {
    preview.classList.add('one');
  } else if (files.length === 2) {
    preview.classList.add('two');
  } else if (files.length >= 3) {
    preview.classList.add('three-or-more');
  }
  for (let i = 0; i < files.length; i++) {
    const base64 = await convertBase64(files[i]);
    postImages.push(base64);
    const img = document.createElement('img');
    img.src = base64;
    preview.appendChild(img);
  }
});

async function addPost() {

  const description = document.getElementById('description').value;
  let id = localStorage.getItem('id') || "";

  if (!id) {
    return;
  }

  // if no image then show aleret
  if (postImages.length === 0) {
    alert("Please select at least one image.");
    return;
  }

  console.log("idis", id);

  const response1 = await fetch(`/api/getUser/${id}`);
  const user_data = await response1.json();

  console.log("userdat", user_data);

  let username = user_data.username;
  let profile_pic = user_data.profile_pic;

  //take user id and pass to post database
  let userid = user_data._id;

  // post array
  let data = { username, post: postImages, description, profile_pic, userid };

  console.log("data",data);
  let options = {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data)
  };

  try {
    const response = await fetch('/api/addPost', options);
    const data = await response.json();

    if (response.status === 201) {
      alert(data.message);
      window.location.href = "/";
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
    // error
    alert("An error occurred while posting.");
  }
}

//convert image to base64
function convertBase64(file) {
  return new Promise((resolve, reject) => {
    //create object of file reader class
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    //when reading is done
    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    //if error then reject with error
    fileReader.onerror = () => {
      reject(fileReader.error);
    };
  });
}
