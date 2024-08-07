import express from 'express';
import { bannerRoutes } from '../modules/banner/banner.route.js';
import userRoutes from '../modules/user/user.route.js';
import cookieRoutes from '../modules/cookie/cookie.route.js';
import { downloadRoutes } from '../modules/download/download.route.js';
import { supportRoutes } from '../modules/support/support.route.js';

import licenseRoutes from '../modules/license/license.route.js';

const router = express.Router();

router.use("/api/user", userRoutes);
router.use("/api/banner", bannerRoutes);
router.use("/api/support", supportRoutes);
router.use("/api/download", downloadRoutes);
router.use('/api/license', licenseRoutes)
router.use("/api/cookie", cookieRoutes);

export default router;
