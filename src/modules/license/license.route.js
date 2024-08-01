import express from 'express';
import {
  allLicenses,
  createLicense,
  activateLicense,
  updateLicense,
  deleteLicense,
} from './license.controller.js';
const router = express.Router();
import { adminMiddleware } from '../../middleware/isAdmin.js';

router.get('/', adminMiddleware('admin'), allLicenses);
router.post('/create', createLicense);
router.put('/activate', adminMiddleware('admin'), activateLicense);
router.put('/update/:id', updateLicense);
router.delete('/delete/:id', deleteLicense);
export default router;
