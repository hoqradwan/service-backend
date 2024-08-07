import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import {
  activateLicense,
  allLicenses,
  createLicense,
  deleteLicense,
  licenseByUser,
  updateLicense,
} from './license.controller.js';
import { activateLicenseValidationSchema, createLicenseValidationSchema, updateLicenseValidationSchema } from './license.validation.js';
const router = express.Router();

router.get('/', allLicenses);
router.get('/user-licenses/:id', licenseByUser);
router.post('/create', validateRequest(createLicenseValidationSchema), createLicense);
router.put('/activate', adminMiddleware('user'), validateRequest(activateLicenseValidationSchema), activateLicense);
router.put('/update/:id', validateRequest(updateLicenseValidationSchema), updateLicense);
router.delete('/delete/:id', deleteLicense);
export default router;
