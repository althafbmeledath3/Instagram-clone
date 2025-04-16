
import express from "express"

import { signUp,logIn , getUser } from "../controller/user_controller.js"

import { addPost,loadPosts } from "../controller/post_controller.js"

import auth from "../middlewares/auth.js"



const insta_routes = express.Router()



insta_routes.post("/signUp",signUp)

insta_routes.post("/logIn",logIn)

insta_routes.post("/addPost",addPost)

insta_routes.get("/loadPosts",auth,loadPosts)

insta_routes.get("/getUser/:id",getUser)


export default insta_routes
