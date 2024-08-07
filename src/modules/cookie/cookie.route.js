import express from 'express';
import validateRequest from '../../middleware/validateRequest.js';
import { createCookie, deleteCookieById, getAllCookies, getCookieById, updateCookieById } from './cookie.controller.js';
import { createCookieValidationSchema, updateCookieValidationSchema } from './cookie.validation.js';

const router = express.Router();

router.get('/all-cookies', getAllCookies);
router.get('/:id', getCookieById);

router.post('/', validateRequest(createCookieValidationSchema), createCookie);
router.put('/:id', validateRequest(updateCookieValidationSchema), updateCookieById);
router.delete('/:id', deleteCookieById);


export default router;
