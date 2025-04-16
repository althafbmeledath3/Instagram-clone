
let username = document.getElementById('username')
let num_posts = document.getElementById('num_posts')

async function loadProfile(){


    try{

        
        
        let id = localStorage.getItem('id')
        
        //fetch data using id
        const response1 = await fetch(`/api/getUser/${id}`)
        
        const data1 = await response1.json()
        
        username.textContent = data1.username

        //now hit the posts section api with the users id
        const response2 = await fetch(`/api/getPost/${id}`)

        const data2 = await response2.json()

        console.log(data2)
        
    }

    catch(err){

        console.log(err)

    }

    



}


loadProfile()

























