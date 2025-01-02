import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';

const router = express.Router();

// router.post('/add-device', adminMiddleware('user'), getServiceStatus);

export default router;
