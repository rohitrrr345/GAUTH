import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";


// Load environment variables
dotenv.config({ path: './config/config.env' });

// Create an instance of express
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
  
// Importing Routes
import postRoutes from './routes/post.js';
import userRoutes from './routes/user.js';

// Using Routes
app.use('/api/v1', postRoutes);
app.use('/api/v1', userRoutes);


export default app;
