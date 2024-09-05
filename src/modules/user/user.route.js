import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import {
  deleteUser,
  forgotPassword,
  getAdminPassword,
  getSelfInfo,
  getUserInfo,
  getUserStatistics,
  loginUser,
  // logout,
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
// router.post('/logout', adminMiddleware('user', 'admin'), logout);

router.put(
  '/update/:userId',
  //adminMiddleware('user'),.
  validateRequest(updateUserValidationSchema),
  updateUser,
);

router.delete('/delete/:userId', adminMiddleware('admin'), deleteUser);
router.get(
  '/admin-password/:userId',
  adminMiddleware('admin'),
  getAdminPassword,
); // Admin can login generating new password in any user account
router.get('/user-list', adminMiddleware('admin'), getUserInfo);

router.get('/information/:id', getSelfInfo);
router.get('/user-stats', adminMiddleware('admin'), getUserStatistics);

export default router;
