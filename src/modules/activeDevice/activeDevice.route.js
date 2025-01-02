import express from 'express';
import {
  logoutAllDevicesController,
  logOutFromCurrentDeviceController,
} from './activeDevice.controller.js';
import { adminMiddleware } from '../../middleware/auth.js';

const router = express.Router();

router.post(
  '/log-out',
  adminMiddleware('user'),
  logOutFromCurrentDeviceController,
);
router.post('/sign-out-all', logoutAllDevicesController);

export const activeDeviceRoutes = router;
