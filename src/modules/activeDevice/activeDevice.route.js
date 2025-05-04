import express from 'express';
import {
  isUserSessionValidController,
  logoutAllDevicesController,
  logOutFromCurrentDeviceController,
  totalLoggedInDeviceController,
} from './activeDevice.controller.js';
import { adminMiddleware } from '../../middleware/auth.js';

const router = express.Router();

router.post(
  '/log-out',
  adminMiddleware('user','admin'),
  logOutFromCurrentDeviceController,
);
router.post(
  '/sign-out-all',
  adminMiddleware('user'),
  logoutAllDevicesController,
);
router.post('/is-session-valid', isUserSessionValidController);
router.get(
  '/logged-in-devices',
  adminMiddleware('user'),
  totalLoggedInDeviceController,
);

export const activeDeviceRoutes = router;
