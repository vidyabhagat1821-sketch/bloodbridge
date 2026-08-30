import { Router } from 'express';
import { RequestController } from '../controllers/requestController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateBloodRequestInput } from '../middlewares/validator.js';

const router = Router();

router.get('/', RequestController.getAllRequests);
router.post('/', validateBloodRequestInput, RequestController.createRequest);
router.get('/:id', RequestController.getRequestById);
router.put('/:id', RequestController.updateRequest);
router.delete('/:id', RequestController.deleteRequest);

// Lifecycle actions
router.post('/:id/match', RequestController.matchDonors);
router.post('/:id/respond', RequestController.respondToRequest);
router.post('/:id/complete', RequestController.completeRequest);

export default router;
