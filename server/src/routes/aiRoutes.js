import { Router } from 'express';
import { AIController } from '../controllers/aiController.js';

const router = Router();

router.post('/parse-blood-request', AIController.parseBloodRequest);

export default router;
