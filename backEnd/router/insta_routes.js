
import express from "express"

import { signUp,logIn } from "../controller/user_controller.js"

import { addPost,loadPosts } from "../controller/post_controller.js"

import auth from "../middlewares/auth.js"



const insta_routes = express.Router()



insta_routes.post("/signUp",signUp)

insta_routes.post("/logIn",logIn)

insta_routes.post("/addPost",addPost)


insta_routes.get("/loadPosts",auth,loadPosts)

export default insta_routes




























