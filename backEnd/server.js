import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connection from './connection.js';
import insta_routes from './router/insta_routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Allow preflight requests
app.options('*', cors());


// Apply CORS middleware globally
app.use(cors({
    origin: ['http://localhost:4000', 'https://instagram-clone-1-frontend1.onrender.com'], // Frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // If you are using cookies or sessions
  }));
  

app.use(express.json({ limit: '50mb' }));

app.use(cors())

// API routes
app.use('/api', insta_routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

connection().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
});