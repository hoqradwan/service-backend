import express from 'express';
import { handleDownload } from './download.controller';

const router = express.Router();

router.post('/envato-elements', handleDownload);

export default router;
