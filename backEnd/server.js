import express from 'express'
import url from 'url'
import path, { dirname,join } from "path"
import connection from './connection.js'

import insta_routes from "./router/insta_routes.js"

import env from "dotenv"

env.config()


const file_name = url.fileURLToPath(import.meta.url)

const __dirname = dirname(file_name)

const frontEnd = join(__dirname,"..","frontEnd")
const port = 4000

const app = express()


app.use(express.json({limit:"50mb"}))

app.use(express.static(frontEnd))

app.use("/api",insta_routes)




//connect database then start the server
connection().then(()=>{
    app.listen(port,()=>{
        console.log("Server Running on http://localhost:4000")
    })
})


