import express from 'express';
import {
    generateDocument, saveDocument, getDocuments, getDocument, deleteDocument, getTemplates,
} from '../controllers/document.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT(['user', 'admin']));

router.get('/templates', getTemplates);
router.post('/generate', generateDocument);
router.post('/', saveDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

export default router;
