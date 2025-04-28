import postSchema from "../models/post.model.js"

import userSchema from "../models/user.model.js"


// import { v2 as cloudinary } from 'cloudinary';

export const addPost = async function addPost(req,res){

 

    try{

       const files = req.files

       const {username,description,profile_pic,userid} = req.body


       if(!username ||!files || !description || !profile_pic || !userid ){

        return res.status(404).json({message:"Please fill all the fileds"})
       }


       let post = []

       for(let i=0;i<files.length;i++){
 
         post.push(files[i].path)
         
       }
          
       const data = postSchema.create({username,post,description,profile_pic,userid})

       res.status(201).json({message:"Post Uploaded Successfully"})
       
    }

    catch(err){

        console.log(err)

        res.status(500).json({message:err})
    }
}


// Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // 'instagram'
//   api_key: process.env.CLOUDINARY_API_KEY, // '614988553485296'
//   api_secret: process.env.CLOUDINARY_API_SECRET, // Your new secret
// });

// export const addPost = async (req, res) => {
//   try {
//     const { username, description, profile_pic, userid } = req.body;
//     const files = req.files;

//     // Validate inputs
//     if (!username || !files || files.length === 0 || !description || !profile_pic || !userid) {
//       return res.status(400).json({ message: 'Please fill all fields and upload at least one image' });
//     }

//     // Verify user exists
//     const user = await userSchema.findById(userid);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Upload images to Cloudinary
//     const imageUrls = [];
//     for (const file of files) {
//       const result = await cloudinary.uploader.upload(
//         `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
//         {
//           folder: 'instagram_clone',
//           resource_type: 'image',
//           transformation: [{ width: 800, crop: 'scale', quality: 'auto' }],
//         }
//       );
//       imageUrls.push(result.secure_url);
//     }

//     // Create post in database
//     const post = await postSchema.create({
//       username,
//       post: imageUrls,
//       description,
//       profile_pic,
//       userid,
//       likes: [],
//     });

//     res.status(201).json({ message: 'Post uploaded successfully' });
//   } catch (err) {
//     console.error('Error in addPost:', err);
//     res.status(500).json({ message: 'Failed to upload post' });
//   }
// };



export const loadPosts = async function loadPosts(req,res){

    // console.log("Inside Load posts")

    // console.log(req.user)

    const userData = await userSchema.findOne({_id:req.user})

  //  console.log(userData)


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
  



  export async function likePost(req, res) {

    const { postId, userId } = req.body;
  
    try {
      const post = await postSchema.findById(postId);


      console.log(post.likes)
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // if already liked remove it else like the post
      const alreadyLiked = post.likes.includes(userId);
  
      if (alreadyLiked) {
        post.likes = post.likes.filter(id => id !== userId);
      } else {
        post.likes.push(userId);
      }
  
      await post.save();
  
      return res.status(200).json({
        message: alreadyLiked ? "Post unliked" : "Post liked",
        likesCount: post.likes.length
      });
  
    } catch (error) {
      console.error("Error liking post:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  


  export async function handleUpload(req, res) {

    try{

      let files = req.files;

      console.log(files)

      let post = []

      for(let i=0;i<files.length;i++){

        post.push(files[i].path)
        
      }

      console.log("THis is path",post)
      
      if(!files){
        return res.status(404).json({message:"No File Found"})
      }
      
      return res.status(200).json({message:"File Uploaded Successfully"})
      
    }

    catch(error){

      return res.status(500).json({message:"Internal Server Error"})
    }
    

  }
  