import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';
import { addDownload, getMyDownloads } from './download.controller.js';

const router = express.Router();

router.post('/add', adminMiddleware('user'), addDownload);
router.get('/my-downloads', adminMiddleware('user'), getMyDownloads);

export const downloadRoutes = router;
