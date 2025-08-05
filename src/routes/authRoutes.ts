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
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: true
  }),
  (req, res) => {
    req.session.save(() => {
      res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    });
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
