import User from '../models/User';

export const findOrCreateUser = async (profile: any) => {
  const existingUser = await User.findOne({ googleId: profile.id });

  if (existingUser) return existingUser;

  const newUser = new User({
    googleId: profile.id,
    name: profile.displayName,
    email: profile.emails?.[0].value,
    photo: profile.photos?.[0].value, // ✅ Add this
  });

  await newUser.save();
  return newUser;
};
