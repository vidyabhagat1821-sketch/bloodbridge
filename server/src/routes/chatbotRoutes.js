import { Router } from 'express';
import { ChatbotController } from '../controllers/chatbotController.js';

const router = Router();

router.post('/ask', ChatbotController.ask);
router.get('/history', ChatbotController.getHistory);

export default router;
