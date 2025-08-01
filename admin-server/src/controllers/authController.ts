import { Request, Response } from 'express';
import { adminCredentials } from '../config/adminCredentials';

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === adminCredentials.email && password === adminCredentials.password) {
    return res.json({ success: true });
  }

  return res.json({ success: false });
};
