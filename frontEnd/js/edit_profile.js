//get all the inpout filesds using id from html

let preview = document.getElementById('preview')
let username = document.getElementById('username')
let email = document.getElementById('email')
let phone = document.getElementById('phone')

const id = localStorage.getItem('id')


let profile_pic = ""
document.getElementById('profile_pic').addEventListener('change',async(e)=>{
    const profile_pic_img = e.target.files[0]
    profile_pic = await convertBase64(profile_pic_img)
    document.getElementById('preview').innerHTML = `<img class="profile-preview" src="${profile_pic}" />`;

})


//load the uwer data in edit initially

async function loadUser(){

    //get id from locastorage
    


    //now hit the api getuser

    const response = await fetch(`/api/getUser/${id}`)

    const data = await response.json()

    console.log(data)

    preview.innerHTML =  `<img class="profile-preview" src="${data.profile_pic}" />`;

    username.value = data.username
    email.value = data.email
    phone.value = data.phone
    profile_pic = data.profile_pic

}


//call the function loaduser
loadUser()



async function signUp(e){

    e.preventDefault()

    let username = document.getElementById('username').value

    let email = document.getElementById('email').value

    let phone = document.getElementById('phone').value

   
    let data = {profile_pic,username,email,phone}

    let options = {
        headers:{"Content-Type":"application/json"},
        method:"POST",
        body:JSON.stringify(data)
    }

    try{

        const response = await fetch(`/api/editUser/${id}`,options)
        
        const data = await response.json()

        console.log(data)

        if(response.status===200){
            alert(data.message)
            window.location.href = "/profile.html"
        }

        else{
            alert(data.message)
        }

    }
    catch(err){
        console.log(err)
        alert(data.message)
    }



}



//function to convert image to base64
function convertBase64(file){

    return new Promise((resolve,reject)=>{
        //create object of file reader class
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)

        //when reading is done
        fileReader.onload = ()=>{
            resolve(fileReader.result)
        }

        //if error then reject with error
        fileReader.onerror = ()=>{
            reject(fileReader.error)
        }
    })
}