import express from 'express';
import { deleteUser, loginUser, registerUser, updateUser } from './user.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.put('/update/:userId', updateUser);
router.delete('/delete/:userId', deleteUser);


export default router;