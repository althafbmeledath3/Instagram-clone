


async function logIn(e){


    e.preventDefault()

    let email = document.getElementById('email').value
    let password = document.getElementById('password').value


    let data = {email,password}

    let options = {
        headers:{"Content-Type":"application/json"},
        method:"POST",
        body:JSON.stringify(data)
    }


    try{

        const response = await fetch("/api/logIn",options)

        const data = await response.json()

        if(response.status===200){

            localStorage.setItem("token",data.token)

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