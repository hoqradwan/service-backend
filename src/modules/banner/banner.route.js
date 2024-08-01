import express from 'express';
import { createBanner, deleteBanner, getAllBanner } from './banner.controller.js';

const router = express.Router();

router.get('/all', getAllBanner);
router.post('/create', createBanner);
router.delete('/delete/:id', deleteBanner);

export const bannerRoutes = router;
