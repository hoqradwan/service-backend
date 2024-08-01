import express from 'express';
import { handleDownload } from './cookie.controller.js';
import { loginRequest } from './cookie.service.js';

const router = express.Router();

router.post('/download', handleDownload);
router.post('/login', loginRequest);

export default router;
