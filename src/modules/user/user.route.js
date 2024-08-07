import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import {
  deleteUser,
  forgotPassword,
  getAdminPassword,
  getSelfInfo,
  getUserInfo,
  loginUser,
  registerUser,
  resetPassword,
  updateUser,
} from './user.controller.js';
import {
  loginValidationSchema,
  registerUserValidationSchema,
  updateUserValidationSchema,
} from './user.validation.js';

const router = express.Router();

router.post(
  '/register',
  validateRequest(registerUserValidationSchema),
  registerUser,
);
router.post('/login', validateRequest(loginValidationSchema), loginUser);
router.post('/forget-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.put(
  '/update/:userId',
  validateRequest(updateUserValidationSchema),
  updateUser,
);

router.delete('/delete/:userId', deleteUser);
router.get('/admin-password/:userId', getAdminPassword); // Admin can login generating new password in any user account
router.get('/user-list', adminMiddleware('admin'), getUserInfo);

router.get('/information/:id', getSelfInfo);

export default router;
