import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';
import { createNotification } from './notification.controller.js';
const router = express.Router();


router.post("/",adminMiddleware(),createNotification);

export const notificationRoutes = router;