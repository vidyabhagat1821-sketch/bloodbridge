import { Router } from 'express';
import { HospitalController } from '../controllers/hospitalController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/', HospitalController.getAllHospitals);
router.get('/:id', HospitalController.getHospitalById);
router.put('/:id', authenticate, HospitalController.updateHospital);

export default router;
