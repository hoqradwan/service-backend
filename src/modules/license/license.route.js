import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import {
  activateLicense,
  allLicenses,
  createLicense,
  deleteLicense,
  getDailyStatisticsForUsedLicenses,
  licenseByUser,
  suspendLicense,
  updateLicense,
} from './license.controller.js';
import {
  activateLicenseValidationSchema,
  createLicenseValidationSchema,
  updateLicenseValidationSchema,
} from './license.validation.js';
const router = express.Router();

router.get('/',adminMiddleware('admin'), allLicenses);
router.get('/user-licenses/:id',adminMiddleware('user'), licenseByUser);
router.get('/daily-stats',adminMiddleware('admin'), getDailyStatisticsForUsedLicenses);
// router.post('/create',adminMiddleware('admin'), createLicense);
router.post('/create', createLicense);
router.put(
  '/activate',
  adminMiddleware('user'),
  validateRequest(activateLicenseValidationSchema),
  activateLicense,
);
router.put(
  '/update/:id',
  adminMiddleware('admin'),
  validateRequest(updateLicenseValidationSchema),
  updateLicense,
);
router.put(
  '/change-status/:id',
  adminMiddleware('admin'),
  suspendLicense,
);
router.delete('/delete/:id',adminMiddleware('admin'), deleteLicense);

export default router;


