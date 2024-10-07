import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import {
  createBanner,
  deleteBanner,
  getAllBanner,
  updateBanner,
} from './banner.controller.js';
import {
  createBannerValidationSchema,
  updateBannerValidationSchema,
} from './banner.validation.js';

const router = express.Router();

router.get('/all', getAllBanner);
router.post(
  '/create',
  adminMiddleware('admin'),
  validateRequest(createBannerValidationSchema),
  createBanner,
);
router.patch(
  '/update/:id',
  adminMiddleware('admin'),
  validateRequest(updateBannerValidationSchema),
  updateBanner,
);
router.delete('/delete/:id', adminMiddleware('admin'), deleteBanner);

export const bannerRoutes = router;
