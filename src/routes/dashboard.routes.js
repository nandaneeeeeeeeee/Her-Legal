import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getStats, getActivity } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/stats', verifyJWT(['user', 'admin']), getStats);
router.get('/activity', verifyJWT(['user', 'admin']), getActivity);

export default router;
