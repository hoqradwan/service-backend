import express from 'express';
import userRoutes from '../modules/user/user.route.js';
import cookieRoutes from '../modules/cookie/cookie.route.js';
import licenseRoutes from '../modules/license/license.route.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/evanto', cookieRoutes);
router.use('/license', licenseRoutes);

export default router;
