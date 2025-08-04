// src/services/userService.ts

export const getUserInfoFromSession = (user: any) => {
  if (!user) return null;

  return {
    name: user.name,
    email: user.email,
    photo: user.photo,
  };
};
