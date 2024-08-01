import express from 'express';
import { adminMiddleware } from '../../middleware/isAdmin.js';
import { addDownload, getMyDownloads, handleDownload } from './download.controller.js';

const router = express.Router();

router.post('/add', adminMiddleware('user'), addDownload);
router.get('/my-downloads', adminMiddleware('user'), getMyDownloads);
router.post('/envato-elements', handleDownload);

export const downloadRoutes = router;





