import express from 'express';
import userRoutes from '../modules/user/user.route.js';
import downloadRoutes from '../modules/download/download.route.js';
import cookieRoutes from '../modules/cookie/cookie.route.js';

const router = express.Router();

router.use("/user", userRoutes);
router.use("/download", downloadRoutes);
router.use("/cookie", cookieRoutes);

export default router;