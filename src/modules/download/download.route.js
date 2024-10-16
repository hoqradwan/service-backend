import express from 'express';
import { adminMiddleware } from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import {
  addDownload,
  getDailyDownloadForCookie,
  getDailyDownloadForLicense,
  getDailyEnvatoDownloadForUser,
  getDailyFreepikDownloadForUser,
  getDailyMotionArrayDownloadForUser,
  getDailyStoryBlocksDownloadForUser,
  getMyDownloads,
  getTotalDownloadForCookie,
  getTotalDownloadForLicense,
  getTotalDownloadsForUser,
  getTotalEnvatoDownloadForUser,
  getTotalFreepikDownloadForUser,
  getTotalMotionArrayDownloadForUser,
  getTotalStoryBlocksDownloadForUser,
  handleEnvatoDownload,
  handleFreePikDownload,
  handleLicenseDownload,
  handleMotionArrayDownload,
  handleStoryBlocksDownload,
  updateDownloadById,
} from './download.controller.js';
import {
  downloadValidationSchema,
  storeDownloadValidationSchema,
} from './download.validation.js';

const router = express.Router();

router.post(
  '/add',
  adminMiddleware('user'),
  validateRequest(storeDownloadValidationSchema),
  addDownload,
);
// daily download count apis
router.get(
  '/user-daily-envato-download/:id',
  adminMiddleware('admin', 'user'),
  getDailyEnvatoDownloadForUser,
);
router.get(
  '/user-daily-story-blocks-download/:id',
  adminMiddleware('admin', 'user'),
  getDailyStoryBlocksDownloadForUser,
);
router.get(
  '/user-daily-motion-array-download/:id',
  adminMiddleware('admin', 'user'),
  getDailyMotionArrayDownloadForUser,
);
router.get(
  '/user-daily-freepik-download/:id',
  adminMiddleware('admin', 'user'),
  getDailyFreepikDownloadForUser,
);
///////////
// total download count apis
router.get(
  '/user-total-download/:id',
  adminMiddleware('admin', 'user'),
  getTotalDownloadsForUser,
);
router.get(
  '/user-total-envato-download/:id',
  adminMiddleware('admin', 'user'),
  getTotalEnvatoDownloadForUser,
);
router.get(
  '/user-total-story-blocks-download/:id',
  adminMiddleware('admin', 'user'),
  getTotalStoryBlocksDownloadForUser,
);
router.get(
  '/user-total-motion-array-download/:id',
  adminMiddleware('admin', 'user'),
  getTotalMotionArrayDownloadForUser,
);
router.get(
  '/user-total-freepik-download/:id',
  adminMiddleware('admin', 'user'),
  getTotalFreepikDownloadForUser,
);
/////////
router.get(
  '/license-daily-download',
  adminMiddleware('user'),
  getDailyDownloadForLicense,
);
router.get(
  '/license-total-download',
  adminMiddleware('user'),
  getTotalDownloadForLicense,
);
router.get(
  '/service-daily-download',
  adminMiddleware('admin'),
  getDailyDownloadForCookie,
);
router.get(
  '/service-total-download',
  adminMiddleware('admin'),
  getTotalDownloadForCookie,
);
router.get('/my-downloads', adminMiddleware('user'), getMyDownloads);
router.post('/envato-elements', adminMiddleware('user'), handleEnvatoDownload);
router.post(
  '/story-blocks',
  adminMiddleware('user'),
  handleStoryBlocksDownload,
);
router.post(
  '/motion-array',
  adminMiddleware('user'),
  handleMotionArrayDownload,
);
router.post('/freepik', adminMiddleware('user'), handleFreePikDownload);
router.get(
  '/envato-elements-license/:downloadId',
  adminMiddleware('user'),
  handleLicenseDownload,
);
router.put('/:id', adminMiddleware('user'), updateDownloadById); // given download id.

export const downloadRoutes = router;
