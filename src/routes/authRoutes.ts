import { Router } from 'express';
import {IUser} from '../models/User';

import jwt from 'jsonwebtoken';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

const JWT_SECRET = process.env.JWT_KEY || 'defaultSecretKey';

// Route to start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user as IUser; // fetched by Passport
 const token = jwt.sign({ id: user.id }, JWT_SECRET, {
  expiresIn: '1d',
});
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  }
);

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

export default router;
