import postSchema from "../models/post.model.js"

import userSchema from "../models/user.model.js"


export const addPost = async function addPost(req,res){


    try{

       const {username,post,description,profile_pic,userid} = req.body

       if(!username ||!post || !description || !profile_pic || !userid ){

        return res.status(404).json({message:"Please fill all the fileds"})
       }

       
       const data = postSchema.create({username,post,description,profile_pic,userid})

       res.status(201).json({message:"Post Uploaded Successfully"})
       
    }

    catch(err){

        console.log(err)

        res.status(500).json({message:err})
    }
}



export const loadPosts = async function loadPosts(req,res){

    console.log("Inside Load posts")

    console.log(req.user)

    const userData = await userSchema.findOne({_id:req.user})

   console.log(userData)


    try{
        const data = await postSchema.find()
        res.status(200).send({data,userData})
    }

    catch(err){

        res.status(500).send({error:err})
    }
}



export const getPost = async function getPost(req,res){


    try{

        
        console.log("Inside get posts")
        
        let userid = req.params.id
        
        console.log("userd",userid)
        
        const userData = await postSchema.find({userid})

        res.status(200).send(userData)
        
    }
    
    catch(err){


        console.log(err)
        res.status(500).json({message:err})
    }
   
}


export const deleteProfile = async function deleteProfile(req, res) {

    try {

      const id = req.params.id;
  
      // Delete all posts of user
      const post_delete = await postSchema.deleteMany({ userid: id });
  
      // delete the user
      const user_delete = await userSchema.findByIdAndDelete(id);
  
      if (!user_delete) {
        return res.status(404).json({ message: "User not found" });
      }
  

      res.status(200).json({message:"User Deleted Successfully"})



    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  };
  




