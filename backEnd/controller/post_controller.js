import postSchema from "../models/post.model.js"

import userSchema from "../models/user.model.js"


export const addPost = async function addPost(req,res){


    try{

       const {post,description} = req.body

       if(!post || !description ){

        return res.status(404).json({message:"Please fill all the fileds"})
       }

       
       const data = postSchema.create({post,description})

       res.status(201).json({message:"Post Uploaded Successfully"})
       
    }

    catch(err){

        console.log(err)

        res.status(500).json({message:err})
    }
}






export const loadPosts = async function loadPosts(req,res){

    console.log("Inside Load posts")

    const userData = await userSchema.findOne({_id:req.user})


    try{
        const data = await postSchema.find()
        res.status(200).send({data,userData})
    }

    catch(err){

        res.status(500).send({error:err})
    }

    

    
}