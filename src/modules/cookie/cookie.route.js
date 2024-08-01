import express from 'express';
import { loginRequest } from './cookie.service.js';
import { createCookie } from './cookie.controller.js';

const router = express.Router();

router.post('/', createCookie);
// router.post('/login', loginRequest);


export default router;
