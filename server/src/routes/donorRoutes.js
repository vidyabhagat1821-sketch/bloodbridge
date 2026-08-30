import { Router } from 'express';
import { DonorController } from '../controllers/donorController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/', DonorController.getAllDonors);
router.get('/:id', DonorController.getDonorById);
router.put('/:id', authenticate, DonorController.updateDonor);
router.put('/:id/availability', authenticate, DonorController.updateAvailability);

export default router;
