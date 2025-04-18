



async function verify_otp(e) {


    e.preventDefault()

    let email = localStorage.getItem('email')

    let otp = document.getElementById('otp').value

    let data = {email,otp}

    let options = {
        headers:{"Content-Type":"application/json"},
        method:"POST",
        body:JSON.stringify(data)
    }

    try{


        
        const response = await fetch('/api/verify_otp',options)
        
        const data1 = await response.json()
        
        if(response.status===200){
            
            alert(data1.message)

            

            window.location.href="/pass_reset.html"
        }
        
        else{
            
            alert(data1.message)
        }
        
    }

    catch(err){

        console.log(err)

        alert(err)
    }
    
}