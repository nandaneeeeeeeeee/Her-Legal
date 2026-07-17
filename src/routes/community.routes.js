import express from 'express';
import {
    createPost, getPosts, getPost, getMyPosts, getSavedPosts, deletePost,
    reactToPost, savePost, reportPost,
    addComment, getComments, deleteComment,
} from '../controllers/community.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/:id/comments', getComments);

// Auth required
router.post('/', verifyJWT(['user', 'admin']), createPost);
router.get('/my/posts', verifyJWT(['user', 'admin']), getMyPosts);
router.get('/my/saved', verifyJWT(['user', 'admin']), getSavedPosts);
router.delete('/:id', verifyJWT(['user', 'admin']), deletePost);

router.post('/:id/react', verifyJWT(['user', 'admin']), reactToPost);
router.post('/:id/save', verifyJWT(['user', 'admin']), savePost);
router.post('/:id/report', verifyJWT(['user', 'admin']), reportPost);

router.post('/:id/comments', verifyJWT(['user', 'admin']), addComment);
router.delete('/:id/comments/:commentId', verifyJWT(['user', 'admin']), deleteComment);

export default router;
