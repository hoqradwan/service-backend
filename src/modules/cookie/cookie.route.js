import express from 'express';
import validateRequest from '../../middleware/validateRequest.js';
import { createCookie, deleteCookieById, getAllCookies, getCookieById, updateCookieById } from './cookie.controller.js';
import { createCookieValidationSchema, updateCookieValidationSchema } from './cookie.validation.js';
import { adminMiddleware } from '../../middleware/auth.js';

const router = express.Router();

router.get('/all-cookies',adminMiddleware('admin'), getAllCookies);
router.get('/:id',adminMiddleware('admin'), getCookieById);

router.post('/',adminMiddleware('admin'), validateRequest(createCookieValidationSchema), createCookie);
router.put('/:id',adminMiddleware('admin'), validateRequest(updateCookieValidationSchema), updateCookieById);
router.delete('/:id',adminMiddleware('admin'), deleteCookieById);


export default router;
