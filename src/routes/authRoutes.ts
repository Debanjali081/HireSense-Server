import { Router } from 'express';
import {IUser} from '../models/User';

import jwt from 'jsonwebtoken';
import passport from 'passport';
import dotenv from 'dotenv';
import { log } from 'console';
dotenv.config();

const router = Router();


// Route to start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user as IUser; // req.user is populated by Passport
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY!, {
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
