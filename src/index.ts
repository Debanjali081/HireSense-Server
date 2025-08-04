import express, { Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { connectDB } from './config/db';
import './auth/passport'; // Make sure to load strategy

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import resumeRoutes from './routes/resumeRoutes';


dotenv.config();
const app: Application = express();

// Connect to 
connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/resume', resumeRoutes);





export default app;
