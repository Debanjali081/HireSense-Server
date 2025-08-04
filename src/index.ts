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
  origin: 'https://hire-sense-client-faxy-wheat.vercel.app',
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
    cookie: {
      httpOnly: true,
      secure: false, // temporarily false for testing
      sameSite: 'lax', // temporarily lax for testing
      domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined, // set domain for production
    },
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
