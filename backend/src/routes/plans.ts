import { Router } from 'express';
import { getPlans, getPlan } from '../controllers/plans.js';

const router = Router();
router.get('/', getPlans);
router.get('/:id', getPlan);
export default router;
