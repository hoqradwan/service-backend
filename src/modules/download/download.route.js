import express from 'express';
import { addDownload, getMyDownloads } from './download.controller.js';

const router = express.Router();

router.post('/add', addDownload);
router.get('/my-downloads', getMyDownloads);

export const downloadRoutes = router;
