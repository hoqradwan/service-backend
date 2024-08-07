import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import { addDownload, getDailyDownloadForCookie, getDailyDownloadForLicense, getDailyDownloadForUser, getMyDownloads, getTotalDownloadForCookie, getTotalDownloadForLicense, getTotalDownloadForUser, handleDownload } from './download.controller.js';
import { downloadValidationSchema, storeDownloadValidationSchema } from './download.validation.js';

const router = express.Router();

router.post('/add', adminMiddleware('user'), validateRequest(storeDownloadValidationSchema), addDownload);
router.post('/add', adminMiddleware('user'), addDownload);
router.get('/user-daily-download', getDailyDownloadForUser);
router.get('/user-total-download', getTotalDownloadForUser);
router.get('/license-daily-download', getDailyDownloadForLicense);
router.get('/license-total-download', getTotalDownloadForLicense);
router.get('/service-daily-download', getDailyDownloadForCookie);
router.get('/service-total-download', getTotalDownloadForCookie);
router.get('/my-downloads', adminMiddleware('user'), getMyDownloads);
router.post('/envato-elements', handleDownload);

export const downloadRoutes = router;
