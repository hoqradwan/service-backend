import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import {
  addDownload,
  getDailyDownloadForCookie,
  getDailyDownloadForLicense,
  getDailyDownloadForUser,
  getMyDownloads,
  getTotalDownloadForCookie,
  getTotalDownloadForLicense,
  getTotalDownloadForUser,
  handleDownload, handleLicenseDownload,
} from './download.controller.js';
import {
  downloadValidationSchema,
  storeDownloadValidationSchema,
} from './download.validation.js';

const router = express.Router();

router.post(
  '/add',
  adminMiddleware('user'),
  validateRequest(storeDownloadValidationSchema),
  addDownload,
);
router.get(
  '/user-daily-download',
  adminMiddleware('user'),
  getDailyDownloadForUser,
);
router.get(
  '/user-total-download',
  adminMiddleware('user'),
  getTotalDownloadForUser,
);
router.get(
  '/license-daily-download',
  adminMiddleware('user'),
  getDailyDownloadForLicense,
);
router.get(
  '/license-total-download',
  adminMiddleware('user'),
  getTotalDownloadForLicense,
);
router.get(
  '/service-daily-download',
  adminMiddleware('admin'),
  getDailyDownloadForCookie,
);
router.get(
  '/service-total-download',
  adminMiddleware('admin'),
  getTotalDownloadForCookie,
);
router.get('/my-downloads', adminMiddleware('user'), getMyDownloads);
router.post('/envato-elements', adminMiddleware('user'), handleDownload);
router.get('/envato-elements-license/:downloadId',adminMiddleware('user'), handleLicenseDownload);

export const downloadRoutes = router;
