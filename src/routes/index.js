import express from 'express';
import userRoutes from '../modules/user/user.route.js';
// import downloadRoutes from '../modules/download/download.route.js';

const router = express.Router();

router.use("/user", userRoutes);
// router.use("/download", downloadRoutes);

export default router;