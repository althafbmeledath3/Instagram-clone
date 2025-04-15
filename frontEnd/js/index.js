

let posts = document.getElementById('posts')
let str=""
//username
let username = document.getElementById('username')
let profile_pic = document.getElementById('profile_pic')

async function loadPosts(){


    try{

        const response = await fetch("http://localhost:4000/api/loadPosts",{
            headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}
        })

        console.log(response)

        const data = await response.json()
        console.log(data)
        if(response.status===200){

            
            //posts
            data.data.forEach(element => {
                
                str+= `
                
                <div class="post-section">
                <div class="post-header">
                <img src=${data.userData.profile_pic} alt="User" />
                <strong>${data.userData.email.split("@")[0]}</strong>
                </div>
                <img class="post-image" src=${element.post} alt="Post Image" />
                <div class="post-description">
                ${element.description}
                </div>
                </div>`
                
            });
            
            profile_pic.src = data.userData.profile_pic

            posts.innerHTML = str

            username.textContent = `welcome ${data.userData.email.split("@")[0]}`
        }

        else if(response.status===403){

           window.location.href = "/login.html"
        //    window.location.reload()

        }

        

    }


    catch(err){

        console.log(err)
        
    }
}



loadPosts()




//function to signout

function signout(){

    alert("Signing Out")
    localStorage.removeItem("token");
    window.location.href = "/login.html"

}


