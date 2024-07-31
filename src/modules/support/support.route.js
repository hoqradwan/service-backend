import express from 'express';
import {
    createSupport,
    deleteSupport,
    getAllSupport,
} from './support.controller.js';

const router = express.Router();

router.get('/all', getAllSupport);
router.post('/create', createSupport);
router.delete('/delete/:id', deleteSupport);

export const supportRoutes = router;
