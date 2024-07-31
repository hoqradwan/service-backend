import express from 'express';
import { deleteUser, getUserInfo, loginUser, registerUser, updateUser } from './user.controller.js';
import { adminMiddleware } from '../../middleware/isAdmin.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.put('/update/:userId', updateUser);
router.delete('/delete/:userId', deleteUser);

router.get('/information/:id', adminMiddleware, getUserInfo);

export default router;