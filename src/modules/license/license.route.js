import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import {
  activateLicense,
  allLicenses,
  createLicense,
  currentLicensesByUser,
  deleteLicense,
  getDailyStatisticsForEnvatoForUsedLicenses,
  getDailyStatisticsForFreepikForUsedLicenses,
  getDailyStatisticsForMotionArrayForUsedLicenses,
  getDailyStatisticsForStoryBlocksForUsedLicenses,
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
router.get('/user-current-licenses/:id',adminMiddleware('user'), currentLicensesByUser);
router.get('/envato-stats', getDailyStatisticsForEnvatoForUsedLicenses);
router.get('/story-blocks-stats', getDailyStatisticsForStoryBlocksForUsedLicenses);
router.get('/motion-array-stats', getDailyStatisticsForMotionArrayForUsedLicenses);
router.get('/freepik-stats', getDailyStatisticsForFreepikForUsedLicenses);
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


