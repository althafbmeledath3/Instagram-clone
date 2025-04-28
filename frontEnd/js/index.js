
// console.log(localStorage.getItem('token'))

// import { fetch } from "undici-types";

let posts = document.getElementById('posts');
let str = "";

//delclare user id
let userId = null;


//username
let username = document.getElementById('username');
let profile_pic = document.getElementById('profile_pic');



async function loadPosts() {
  try {
    const response = await fetch("http://localhost:4000/api/loadPosts", {
      headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
    });

   if(response.status===403){
     alert("No token")
     window.location.href="/login.html"
   }
   
    const data = await response.json();
    // console.log('Fetched data:', data);

    console.log(data.data[0].post[0])
    if (response.status === 200) {
      // set the id on localstorage
      localStorage.setItem('id', data.userData._id);

      userId = data.userData._id

    
      str = '';

      // generate posts
      const reversed = data.data.reverse()

      reversed.forEach((element, index) => {

    
       
        let images = [];

        if (element.post) {
          images = element.post;
          
        }

        


        // console.log(element.post)
      

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

        const isLiked = element.likes.includes(userId);
        const heartFill = isLiked ? 'red' : 'none';
        const heartClass = isLiked ? 'heart-icon loveIcon beat' : 'heart-icon loveIcon';

        
        str += `
        <div class="post-section">
          <div class="post-header">
            <img src="${element.profile_pic}" alt="User" />
            <strong>${element.username}</strong>
          </div>
          <div class="post-images">${imagesHtml}</div>
          
          <!-- ❤️ SVG Heart Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               width="33" height="33"
               class="${heartClass}"
               stroke="red"
               stroke-width="2"
               fill="${heartFill}"
               stroke-linecap="round"
               stroke-linejoin="round"
               data-postid="${element._id}">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 
            7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>

          <a class="comment-btn">💬</a>
          <a class="share-btn">⤴</a>
          <p class="like-heart">${element.likes.length}M</p>
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

      console.log("all usrs",data2)


      let user_container = document.getElementById('story-contain')

      let str1=''

      data2.forEach((element)=>{

        str1+=`
        
        
        <div class="user-story-container">
        <div class="story-ring">
          <img class="story-pic" src=${element.profile_pic} alt="Dummy User Profile" />
          
        </div>
        <span class="story-username">${element.username}</span>
      </div>
        `

      })
      //story display
      user_container.innerHTML = str1
      // handle heart icon toggles
      
      document.addEventListener('click', (e) => {
        if (e.target.closest('.loveIcon')) {
          const icon = e.target.closest('.loveIcon');
          const isFilled = icon.getAttribute('fill') === 'red';
          const postId = icon.getAttribute('data-postid');
          if (isFilled) {
            icon.setAttribute('fill', 'none');
            icon.classList.remove('beat');
          } else {
            icon.setAttribute('fill', 'red');
            icon.classList.add('beat');
          }

          likePost(postId)
        }
      });

      
      // add swiper for all iposts with class post-swiper
      const swiperElements = document.querySelectorAll('[class*="post-swiper-"]');
      // console.log(`Found ${swiperElements.length} Swiper containers`);
      swiperElements.forEach((swiperEl, i) => {
        // console.log(`Initializing Swiper for post-swiper-${i}`);
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
    alert("User ID not found. Please log in.");
    return;
  }

  if (postImages.length === 0) {
    alert("Please select at least one image.");
    return;
  }

  if (!description) {
    alert("Please provide a description.");
    return;
  }

  try {
    // Fetch user data
    const response1 = await fetch(`/api/getUser/${id}`);
    const user_data = await response1.json();

    if (!response1.ok) {
      alert("Failed to fetch user data.");
      return;
    }

    let username = user_data.username;
    let profile_pic = user_data.profile_pic;
    let userid = user_data._id;

    // Create FormData object
    let formData = new FormData();

    // let img_count = document.getElementById('post').files
    
    for (let i = 0; i < postImages.length; i++) {
      formData.append("file", document.getElementById('post').files[i]);
    }

    // Append other fields
    formData.append("username", username);
    formData.append("description", description);
    formData.append("profile_pic", profile_pic);
    formData.append("userid", userid);

    // Send request
    const response = await fetch('/api/addPost', {
      method: "POST",
      body: formData 
    });

    const data = await response.json();

    if (response.status === 201) {
      alert(data.message);
      window.location.href = "/";
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Error in addPost:", err);
    alert("An error occurred while posting.");
  }
}




async function likePost(postId){


  try{


    
    
    let data = {postId,userId}
    
    let options = {
      headers:{"Content-Type":"application/json"},
      method:"POST",
      body:JSON.stringify(data)}
      
      
      const response = await fetch('/api/likePost',options)
      
      const data1 = await response.json()

      alert(data1.message)


      
    }

    catch(err){

      console.log(err)

      alert(data1.message)
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


// async function addPost() {
//   const files = document.getElementById('post').files;
//   const formData = new FormData();

//   // Loop through all files and append them one by one
//   for (let i = 0; i < files.length; i++) {
//     formData.append("file", files[i]);  
//   }

//   console.log(formData)

//   const response = await fetch('/api/mupload', {
//     method: "POST",
//     body: formData
//   });

//   const result = await response.json();
//   console.log(result);
// }
