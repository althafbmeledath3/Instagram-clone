import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connection from './connection.js';
import insta_routes from './router/insta_routes.js';

import url from 'url'
import path, { dirname,join } from "path"

dotenv.config();

const app = express();
const port =  4000;

const file_name = url.fileURLToPath(import.meta.url)

const __dirname = dirname(file_name)

const frontEnd = join(__dirname, "..", "frontEnd")
app.use(express.static(frontEnd))

  

app.use(express.json({ limit: '50mb' }));

app.use(cors())

// API routes
app.use('/api', insta_routes);

app.use("/images",express.static(path.join(__dirname,"images")))


connection().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
});