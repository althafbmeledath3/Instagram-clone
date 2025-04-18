
let username = document.getElementById('username')
let num_posts = document.getElementById('num_posts')

//under post number name
let under_name = document.getElementById('under_name')

//profile picture
let profile_pic = document.getElementById('profile_pic')
//post div
let posts = document.getElementById('posts')
let str = ""

let id = localStorage.getItem('id')

async function loadProfile(){
    try{
        //fetch data using id
        const response1 = await fetch(`/api/getUser/${id}`)
        
        const data1 = await response1.json()
        
        username.textContent = data1.username
        //set undername texcontent
        under_name.textContent = data1.username

        //change profile picture
        profile_pic.src = data1.profile_pic

        //now hit the posts section api with the users id
        const response2 = await fetch(`/api/getPost/${id}`)

        const data2 = await response2.json()

       
        console.log('Profile posts:', data2);

        //reverse the data2 array to show latest posts first
        let reverse_data2 = data2.reverse()

       
        const postData = [];

        reverse_data2.forEach((element, index) => {

           
            let images = [];
            if (element.post) {
                images = element.post;
            } 

           

            //show first image in the array
            str += `
                <img src="${images[0]}" class="post-image" data-post-index="${index}" />
            `;

            // store in array to show in modal
            postData.push({ images });
        });
        
        posts.innerHTML = str

        //number of posts using posts total length
        num_posts.textContent = data2.length

        // [Updated] Handle modal click with Swiper slider
        document.querySelectorAll('.post-image').forEach((img, i) => {
            img.addEventListener('click', () => {
                const modal = document.getElementById('imageModal');
                const swiperWrapper = document.querySelector('.profile-swiper .swiper-wrapper');
                
                // [New] Get images for this post
                const postImages = postData[img.dataset.postIndex].images;

                // [New] Create swiper slides
                swiperWrapper.innerHTML = postImages.map(imgSrc => `
                    <div class="swiper-slide">
                        <img src="${imgSrc}" alt="Post Image" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px;" />
                    </div>
                `).join('');

                modal.style.display = 'flex';
                document.body.classList.add('modal-open');

                // [New] Initialize Swiper
                new Swiper('.profile-swiper', {
                    slidesPerView: 1,
                    spaceBetween: 10,
                    navigation: {
                        nextEl: '.profile-swiper .swiper-button-next',
                        prevEl: '.profile-swiper .swiper-button-prev'
                    },
                    pagination: {
                        el: '.profile-swiper .swiper-pagination',
                        clickable: true
                    }
                });
            });
        });
    }
    catch(err){
        console.log(err)
    }
}

loadProfile()

//function edit profile
function editProfile(){
    window.location.href="edit_profile.html"
}

//function to delete profile
async function deleteProfile(){
    try{
        const confirmDelete = confirm("Are you sure you want to Delete your Profile?");
        if (!confirmDelete){
            return
        }
        
        const response = await fetch(`/api/deleteProfile/${id}`)
        
        const data = response.json()
        
        if(response.status===200){
            alert("Profile Deleted Successfully")
            
            //clear localstorage token and id
            localStorage.clear()
            
            //now redirect to home page it will go in login page
            window.location.href = "/"
        }
    }
    catch(err){
        console.log(err)
        alert(data.message)
    }
}

function signout(){

    //clear id and token from localstorage
    localStorage.clear()
    alert("Logging out")
    window.location.href = "/"
}

document.addEventListener('click', function (e) {
    const modal = document.getElementById('imageModal')
    if (e.target === modal) {
        modal.style.display = 'none'
        
        document.querySelector('.profile-swiper .swiper-wrapper').innerHTML = '';
        document.body.classList.remove('modal-open')
    }
})
