import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserModel } from './user.model.js';
export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const generateToken = (payload) => {
  const expiresIn = '2h'; // 7 days expire
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });
};

export function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}
