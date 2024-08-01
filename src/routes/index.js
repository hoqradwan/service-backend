import express from 'express';
import { bannerRoutes } from '../modules/banner/banner.route.js';
import cookieRoutes from '../modules/cookie/cookie.route.js';
import { downloadRoutes } from '../modules/download/download.route.js';
import { supportRoutes } from '../modules/support/support.route.js';
import userRoutes from '../modules/user/user.route.js';

const router = express.Router();

router.use("/user", userRoutes);
router.use("/evanto", cookieRoutes);
router.use("/banner", bannerRoutes);
router.use("/support", supportRoutes);
router.use("/download", downloadRoutes);

export default router;