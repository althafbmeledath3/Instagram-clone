
import userSchema from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


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
  


