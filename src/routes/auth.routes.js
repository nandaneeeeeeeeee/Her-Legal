import express from 'express';
import {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
  logout,
} from '../controllers/auth.controller.js';
import {
  validateRequest
} from "../middlewares/validateRequest.middleware.js"
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from '../validators/user.validators.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/verifyEmail', verifyEmail);
router.post('/login', validateRequest(loginSchema), loginUser);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.post('/refreshToken', refreshToken);

router.post(
  '/changePassword',
  verifyJWT(['admin', 'user']),
  validateRequest(changePasswordSchema),
  changePassword
);

router.post('/logout', verifyJWT(['admin', 'user']), logout);

router.get('/validateToken', verifyJWT(['admin', 'user']), (req, res) => {
  res.status(200).json({
    message: 'Access token is valid',
    user: req.user,
  });
});

export default router;