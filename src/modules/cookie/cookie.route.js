import express from 'express';
import { createCookie, getAllCookies, getCookieById, updateCookieById } from './cookie.controller.js';

const router = express.Router();

router.get('/all-cookies', getAllCookies);
router.get('/:id', getCookieById);
router.put('/:id', updateCookieById);
router.post('/', createCookie);


export default router;
