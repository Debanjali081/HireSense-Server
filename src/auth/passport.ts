import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findOrCreateUser } from '../dao/userDao';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

import User from '../models/User';

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'https://hiresense-server.onrender.com/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        console.log('Google OAuth callback profile:', profile);
        const user = await findOrCreateUser(profile);
        console.log('User found or created:', user);
        return done(null, user);
      } catch (err) {
        console.error('Error in Google OAuth callback:', err);
        return done(err as Error, undefined);
      }
    }
  )
);
