import express from 'express';
import { adminMiddleware } from '../../middleware/isAdmin.js';
import { addDownload, getDailyDownloadCount, getDailyDownloadCountForLicense, getMyDownloads, getTotalDownloadCount, getTotalDownloadCountForLicense, handleDownload } from './download.controller.js';

const router = express.Router();

router.post('/add', adminMiddleware('user'), addDownload);
router.post('/add', addDownload);
router.get('/user-daily-count', getDailyDownloadCount);
router.get('/user-total-count', getTotalDownloadCount);
router.get('/license-daily-count', getDailyDownloadCountForLicense);
router.get('/license-total-count', getTotalDownloadCountForLicense);
router.get('/my-downloads', adminMiddleware('user'), getMyDownloads);
router.post('/envato-elements', handleDownload);

export const downloadRoutes = router;





