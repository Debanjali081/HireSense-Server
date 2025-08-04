import { Request, Response } from 'express';
import { getUserInfoFromSession } from '../services/userService';

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const userInfo = getUserInfoFromSession(req.user);

  if (!userInfo) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  res.status(200).json(userInfo);
};
