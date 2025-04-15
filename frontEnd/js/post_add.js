

let post = ""
document.getElementById('post').addEventListener('change',async(e)=>{
    const post_img = e.target.files[0]
    post = await convertBase64(post_img)
    document.getElementById('preview').innerHTML = `<img width="200px" height="auto" src=${post}></img>`
})



async function addPost(e){

    e.preventDefault()

    const description = document.getElementById('description').value

    let data = {post,description}


    let options = {
        headers:{"Content-Type":"application/json"},
        method:"POST",
        body:JSON.stringify(data)
    }

    try{


        const response = await fetch('/api/addPost',options)

        const data = await response.json()

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


//convert image to base64
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
