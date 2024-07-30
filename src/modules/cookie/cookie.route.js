import express from 'express';
import { handleDownload } from './cookie.controller.js';

const router = express.Router();

router.post('/download', handleDownload);

export default router;
