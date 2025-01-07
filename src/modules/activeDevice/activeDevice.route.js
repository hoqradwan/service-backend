import express from 'express';
import {
  isUserSessionValidController,
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
router.post(
  '/sign-out-all',
  adminMiddleware('user'),
  logoutAllDevicesController,
);
router.post('/is-session-valid', isUserSessionValidController);

export const activeDeviceRoutes = router;
