

let profile_pic = ""
document.getElementById('profile_pic').addEventListener('change',async(e)=>{
    const profile_pic_img = e.target.files[0]
    profile_pic = await convertBase64(profile_pic_img)
    document.getElementById('preview').innerHTML = `<img class="profile-preview" src="${profile_pic}" />`;

})



async function signUp(e){

    e.preventDefault()

    let username = document.getElementById('username').value

    let email = document.getElementById('email').value

    let phone = document.getElementById('phone').value

    let password = document.getElementById('password').value

    //confirm password
    let c_password = document.getElementById('cpassword').value
    //check password matching
    if(password!=c_password){
        alert("Paswords do not match")
        return
    }
    

    let data = {profile_pic,username,email,phone,password}

    let options = {
        headers:{"Content-Type":"application/json"},
        method:"POST",
        body:JSON.stringify(data)
    }

    try{

        const response = await fetch('/api/signUp',options)
        
        const data = await response.json()

        console.log(data)

        if(response.status===201){
            alert(data.message)
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