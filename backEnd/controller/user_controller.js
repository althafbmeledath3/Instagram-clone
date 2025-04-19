
import userSchema from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "c02c2fd894074a",
    pass: "e21d18254c39d7",
  },
});



export const signUp = async function signUp(req,res){


    try{

        const { profile_pic,username, email, phone, password } = req.body;
        
        
        if (!( profile_pic && username && email && phone && password)) {
            return res.status(400).json({message:"Please Fill all the details"})
            
        }
        
        //hash the password
        
        bcrypt.hash(password,10).then(async (hashed_pwd)=>{
            
            const data = await userSchema.create({
                profile_pic,
                username,
                email,
                phone,
                password:hashed_pwd
            })
            
            res.status(201).json({message:"User Created Successfully"})
        })
    }

    catch(err){
        console.log(err)
        res.status(400).json({message:"Error in creating user"})
    }


}


export const logIn = async function logIn(req, res) {
    try {
      const { email, password } = req.body;
  
      const userExist = await userSchema.findOne({ email });
  
      //check use exist or not
      if (!userExist) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const ispassMatch = await bcrypt.compare(password, userExist.password);
  
      if (!ispassMatch) {
        return res.status(400).json({ message: "Passwords is wrong" });
      }
  
      const token = await jwt.sign({ id: userExist._id }, process.env.JWT_KEY, {
        expiresIn: "24h",
      });

      

      res.status(200).json({ message: "Logged in success" ,token});
  
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err });
    }
  };
  


//get one user

export const getUser = async function getUser(req,res) {

  try{

    
    const id = req.params.id

    const data = await userSchema.findById(id)

    if(!data){
      return res.status(404).json({message:"Not Found"})
    }

    res.status(200).json(data)
    
  }



  catch(err){

    console.log(err)
    res.status(500).json({messgae:err})
  }


}


//get all users


export const getUsers = async function getUsers(req,res) {

  try{

    
    // const id = req.params.id

    const data = await userSchema.find()

    if(!data){
      return res.status(404).json({message:"Not Found"})
    }

    res.status(200).json(data)
    
  }



  catch(err){

    console.log(err)
    res.status(500).json({messgae:err})
  }


}



export const editUser = async function editUser(req, res) {
  try {

    //get id
    const id = req.params.id;

    const { profile_pic, username, email, phone } = req.body;

    const data = await userSchema.findByIdAndUpdate(
      id,
      { profile_pic, username, email, phone },
      { new: true } 
    );

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({message:"Data Updated Successfully"});

  } 
  
  catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal server error" }); 
  }
};





export async function sendOTP(req,res){

  try{

    
    const {email} = req.body
    
    
    const user = await userSchema.findOne({email})
    
    if(!user){
      
      return res.status(404).json({message:"Email not Found"})
    }
    
    
    let otp = Math.floor(Math.random()*900000)+100000
    
    
    user.otp = otp

    console.log(user.otp)

    await user.save();
    
    const info = await transporter.sendMail({
      from: 'althafbmeledath3@gmail.com', // sender address
      to: email, // list of receivers
      subject: "OTP Verification", // Subject line
      text: 'OTP', // plain text body
      html: `<b>Hello ${user.username} your otp is ${otp}</b>`, // html body
    });
    
    console.log("Message sent: %s", info.messageId);
    
    res.status(200).json({message:"OTP send successfully"})
    
  }

  catch(err){

    console.log(err)
    res.status(500).json({message:err})
  }

}



export async function verify_otp(req,res){

  try{

    
    const {email,otp} = req.body
    
    
    const user = await userSchema.findOne({email})
    
    if(!user){
      
      return res.status(404).json({message:"Email not Found"})
    }
    

    if(user.otp===otp){

      res.status(200).json({message:"OTP verified Successfully"})
    }

    else{

      return res.status(401).json({message:"Incorrecr OTP Entered"})
    }
    
  }

  catch(err){

    console.log(err)
    res.status(500).json({message:err})
  }

}





export async function pass_reset(req,res){

  try{

    
    const {email,password} = req.body
    
    
    const user = await userSchema.findOne({email})
    
    if(!user){
      
      return res.status(404).json({message:"Email not Found"})
    }


    bcrypt.hash(password,10).then(async (hashed_pwd)=>{
            
      user.password = hashed_pwd
      await user.save()


      res.status(200).json({message:"Password reset Successfully"})
  })
    

  
   
    
  }

  catch(err){

    console.log(err)
    res.status(500).json({message:err})
  }

}




export async function delete_otp(req,res){

  try{

    
    const {email} = req.body
    
    
    const user = await userSchema.findOne({email})
    
    if(!user){
      
      return res.status(404).json({message:"Email not Found"})
    }
    

   user.otp = null

   await user.save()

   res.status(200).json({message:"OTP Deleted Successfully from database"})
   
    
  }

  catch(err){

    console.log(err)
    res.status(500).json({message:err})
  }

}