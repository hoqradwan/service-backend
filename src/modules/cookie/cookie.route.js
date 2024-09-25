import express from 'express';
import validateRequest from '../../middleware/validateRequest.js';
import { createCookie, deleteCookieById, getAllCookies, getCookieById, isCookieWorking, updateCookieById } from './cookie.controller.js';
import { createCookieValidationSchema, updateCookieValidationSchema } from './cookie.validation.js';
import { adminMiddleware } from '../../middleware/auth.js';

const router = express.Router();

// router.get('/all-cookies',adminMiddleware('admin'), getAllCookies);
router.get('/all-cookies', getAllCookies);
router.get('/:id', adminMiddleware('admin'), getCookieById);

router.post('/', createCookie);
// router.post('/', adminMiddleware('admin'), validateRequest(createCookieValidationSchema), createCookie);
router.put('/:id', adminMiddleware('admin'), validateRequest(updateCookieValidationSchema), updateCookieById);
router.delete('/:id', adminMiddleware('admin'), deleteCookieById);
router.get('/cookie-check/:id', adminMiddleware('admin'), isCookieWorking);//test cookie


export default router;
