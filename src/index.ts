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

app.set('trust proxy', 1); // trust first proxy for secure cookies behind proxies

// Connect to 
connectDB();

app.use(cors({
  origin: [
    'https://hire-sense-client-faxy-wheat.vercel.app',
    'https://hiresense-server.onrender.com'
  ],
  credentials: true,
  exposedHeaders: ['set-cookie']
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
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true, // Must be true in production
      sameSite: 'none', // Required for cross-site
      domain: process.env.NODE_ENV === 'production' ? 'hiresense-server.onrender.com' : undefined,
      maxAge: 24 * 60 * 60 * 1000
    }
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
