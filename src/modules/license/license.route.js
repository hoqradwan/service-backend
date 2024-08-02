import express from 'express';
import {
  allLicenses,
  createLicense,
  activateLicense,
  updateLicense,
  deleteLicense,
  licenseByUser,
} from './license.controller.js';
const router = express.Router();
import { adminMiddleware } from '../../middleware/auth.js';

router.get('/', allLicenses);
router.get('/user-licenses/:id', licenseByUser);
router.post('/create', createLicense);
router.put('/activate', adminMiddleware('user'), activateLicense);
router.put('/update/:id', updateLicense);
router.delete('/delete/:id', deleteLicense);
export default router;