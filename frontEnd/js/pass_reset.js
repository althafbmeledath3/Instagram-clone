
let email;

async function pass_reset(e){

    e.preventDefault()

    let password = document.getElementById('password').value

    let c_password = document.getElementById('cpassword').value

    if(password!=c_password){

        alert("passwords do not match")

        return 
    }

    email = localStorage.getItem('email')

    let data = {email,password}

    let options = {
        headers:{"Content-Type":"application/json"},
        method:"POST",
        body:JSON.stringify(data)
    }


    try{

        
        const resposne = await fetch('/api/pass_reset',options)

        const data = await resposne.json()

        if(resposne.status===200){

            alert(data.message)

            let data2 = {email}

            let options2 = {
                headers:{"Content-Type":"application/json"},
                method:"POST",
                body:JSON.stringify(data2)
            }
        

            
            const response2 = await fetch('/api/delete_otp',options2)

            const data3 = await response2.json()

            if(response2.status===200){

                alert(data3.message)
            }

            else{

                alert(data3.message)

            }

            localStorage.clear()


            window.location.href="/login.html"
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