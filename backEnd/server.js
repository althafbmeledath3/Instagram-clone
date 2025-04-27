import express from 'express'
import url from 'url'
import path, { dirname,join } from "path"
import connection from './connection.js'

import insta_routes from "./router/insta_routes.js"

import env from "dotenv"

env.config()

import cors from 'cors';
// CORS configuration
app.use(cors({
    origin: 'https://instagram-clone-3-gp0a.onrender.com/',  // Replace with your actual frontend URL
    methods: 'GET,POST,PUT,DELETE',  // Allowed methods
    allowedHeaders: 'Content-Type,Authorization',  // Allowed headers
  }));

const file_name = url.fileURLToPath(import.meta.url)

const __dirname = dirname(file_name)

const frontEnd = join(__dirname,"..","frontEnd")


const port = 4000 || process.env.port

const app = express()


app.use(express.json({limit:"50mb"}))

app.use(express.static(frontEnd))


app.use("/images",express.static(path.join(__dirname,"images")))


app.use("/api",insta_routes)



// Serve frontend static files (production only)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname,"..", 'frontEnd/build')));

  // For any non-API request, serve the frontend's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "..",'frontEnd', 'index.html'));
  });
}




//connect database then start the server
connection().then(()=>{
    app.listen(port,()=>{
        console.log("Server Running on http://localhost:4000")
    })
})


