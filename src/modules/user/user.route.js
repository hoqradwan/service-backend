import express from 'express';
import {
  deleteUser,
  getAdminPassword,
  getUserInfo,
  loginUser,
  registerUser,
  updateUser,
} from './user.controller.js';
import adminMiddleware from '../../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.put('/update/:userId', updateUser);
router.delete('/delete/:userId', deleteUser);
router.get('/admin-password/:userId', getAdminPassword); // -Admin can login generating new password in any user account
router.get('/information', adminMiddleware('admin'), getUserInfo);

export default router;
