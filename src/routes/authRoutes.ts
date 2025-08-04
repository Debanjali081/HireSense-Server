import { Router } from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

// Route to start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true, // required for session-based login
  }),
  (req, res) => {
    // After successful login
   res.redirect(`${process.env.FRONTEND_URL}/dashboard`);

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
