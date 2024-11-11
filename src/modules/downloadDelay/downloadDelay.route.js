import express from 'express';
import {
  getDownloadRestrictions,
  restrictDownload,
  updateDownloadRestriction,
} from './downloadDelay.controller.js';
const router = express.Router();

router.get('/', getDownloadRestrictions);
router.post('/', restrictDownload);
router.post('/update-restriction', updateDownloadRestriction);

export const downloadRestrictRoutes = router;
