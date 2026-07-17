import express from 'express';
import {
    googleAuth,
    sendMagicLink,
    verifyMagicLink,
} from '../controllers/oauth.controller.js';

const router = express.Router();

router.post('/google', googleAuth);
router.post('/magic-link/send', sendMagicLink);
router.post('/magic-link/verify', verifyMagicLink);

export default router;
