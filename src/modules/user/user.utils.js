import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const generateToken = (payload) => {
  const expiresIn = '7d'; // 7 days expire
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });
};