import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import {
  createSupport,
  deleteSupport,
  getAllSupport,
  updateSupport,
} from './support.controller.js';
import {
  createSupportValidationSchema,
  updateSupportValidationSchema,
} from './support.validation.js';

const router = express.Router();

router.get('/all', getAllSupport);
router.post(
  '/create',
  adminMiddleware('admin'),
  validateRequest(createSupportValidationSchema),
  createSupport,
);
router.patch(
  '/update/:id',
  adminMiddleware('admin'),
  validateRequest(updateSupportValidationSchema),
  updateSupport,
);
router.delete('/delete/:id', deleteSupport);

export const supportRoutes = router;
