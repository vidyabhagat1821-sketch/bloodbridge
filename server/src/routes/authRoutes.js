import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateRegistrationInput } from '../middlewares/validator.js';

const router = Router();

router.post('/send-otp', AuthController.sendOtp);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/register', validateRegistrationInput, AuthController.register);
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.getMe);

export default router;
