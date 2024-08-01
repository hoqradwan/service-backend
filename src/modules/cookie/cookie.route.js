import express from 'express';
import { createCookie, deleteCookieById, getAllCookies, getCookieById, updateCookieById } from './cookie.controller.js';

const router = express.Router();

router.get('/all-cookies', getAllCookies);
router.get('/:id', getCookieById);
router.put('/:id', updateCookieById);
router.delete('/:id', deleteCookieById);
router.post('/', createCookie);


export default router;
