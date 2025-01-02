import express from 'express';
import {
  logoutAllDevicesController,
  logOutFromCurrentDeviceController,
} from './activeDevice.controller.js';
import { adminMiddleware } from '../../middleware/auth.js';

const router = express.Router();

router.post('/sign-out-all/:id', logoutAllDevicesController);
router.post(
  '/log-out',
  adminMiddleware('user'),
  logOutFromCurrentDeviceController,
);

export const activeDeviceRoutes = router;
