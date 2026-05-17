import express from 'express';

import { adminMiddleware } from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';

import {
  createNotice,
  deleteNotice,
  getActiveNoticeByService,
  getAllNotice,
  getSingleNotice,
  updateNotice,
} from './notice.controller.js';

import {
  createNoticeValidationSchema,
  updateNoticeValidationSchema,
} from './notice.validation.js';

const router = express.Router();

router.get('/all', adminMiddleware('admin'), getAllNotice);

router.get('/:id', getSingleNotice);

router.get('/active/:service', getActiveNoticeByService);

router.post(
  '/create',
  adminMiddleware('admin'),
  validateRequest(createNoticeValidationSchema),
  createNotice,
);

router.patch(
  '/update/:id',
  adminMiddleware('admin'),
  validateRequest(updateNoticeValidationSchema),
  updateNotice,
);

router.delete('/delete/:id', adminMiddleware('admin'), deleteNotice);

export const noticeRoutes = router;
