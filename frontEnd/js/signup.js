
const backend_url = "https://instagram-clone-1-backend.onrender.com/"

let profile_pic = ""
document.getElementById('profile_pic').addEventListener('change',async(e)=>{
    const profile_pic_img = e.target.files[0]
    profile_pic = await convertBase64(profile_pic_img)
    document.getElementById('preview').innerHTML = `<img class="profile-preview" src="${profile_pic}" />`;

})


let password;

async function signUp(e){

    e.preventDefault()

    let username = document.getElementById('username').value

    let email = document.getElementById('email').value

    let phone = document.getElementById('phone').value.trim();


    let password = document.getElementById('password').value

    //confirm password
    let c_password = document.getElementById('cpassword').value


    if(!profile_pic){

        alert("Please Upload the Photo")

        return
    }

    if(!username){

        alert("Please Enter the Username")
    }


   // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }


    //phone number check
       const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        alert("Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9.");
        return;
    }
    
    

    //password regular expression
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    if (!passwordRegex.test(password)) {
        alert("Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.");

        return;
    }
    
    //check password matching
    if(password!=c_password){
        alert("Paswords do not match")
        return
    }


    let formData = new FormData();

    formData.append("file",document.getElementById('profile_pic').files[0])

    formData.append("username",username)
    formData.append("email",email)
    formData.append("phone",phone)
    formData.append("password",password)
    

    // let data = {profile_pic,username,email,phone,password}

    // let options = {
    //     headers:{"Content-Type":"application/json"},
    //     method:"POST",
    //     body:JSON.stringify(data)
    // }

    try{

        const response = await fetch('https://instagram-clone-1-backend.onrender.com/api/signUp',{
            method:"POST",
            body:formData
        })
        
        const data = await response.json()

        console.log(data)

        if(response.status===201){
            alert(data.message)
            window.location.href = "/"
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