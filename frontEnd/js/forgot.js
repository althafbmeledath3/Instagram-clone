


async function forgot(e){


    
    try{

        
        e.preventDefault()
        
        let email = document.getElementById('email').value
        
        let data = {email}
        
        let options = {
            headers:{"Content-Type":"application/json"},
            method:"POST",
            body:JSON.stringify(data)
        }
        
        const response = await fetch("/api/sendOTP",options)

        const data1 = await response.json()

        console.log(data1)

        if(response.status===200){

            alert(data1.message)

            localStorage.setItem('email',email)

            window.location.href="/otp.html"
        }

        else{

            alert(data1.message)

        }
        
    }

    catch(err){

        console.log(err)
        alert(data1.message)
    }
}