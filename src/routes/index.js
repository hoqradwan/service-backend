import express from 'express';
import { bannerRoutes } from '../modules/banner/banner.route.js';
import cookieRoutes from '../modules/cookie/cookie.route.js';
import userRoutes from '../modules/user/user.route.js';

const router = express.Router();

router.use("/user", userRoutes);
router.use("/evanto", cookieRoutes);
router.use("/banner", bannerRoutes);

export default router;