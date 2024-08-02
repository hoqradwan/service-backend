import express from 'express';
import { adminMiddleware } from '../../middleware/isAdmin.js';
import { addDownload, getDailyDownloadCount, getMyDownloads, getTotalDownloadCount, handleDownload } from './download.controller.js';

const router = express.Router();

router.post('/add', adminMiddleware('user'), addDownload);
router.post('/add', addDownload);
router.get('/daily-count', getDailyDownloadCount);
router.get('/total-count', getTotalDownloadCount);
router.get('/my-downloads', adminMiddleware('user'), getMyDownloads);
router.post('/envato-elements', handleDownload);

export const downloadRoutes = router;





