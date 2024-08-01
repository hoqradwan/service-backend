import express from 'express';
import {
  allLicenses,
  createLicense,
  activateLicense,
  updateLicense,
  deleteLicense,
} from './license.controller.js';
const router = express.Router();

router.get('/', allLicenses);
router.post('/create', createLicense);
router.put('/activate', activateLicense);
router.put('/update/:id', updateLicense);
router.delete('/delete/:id', deleteLicense);
export default router;
