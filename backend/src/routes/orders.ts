import { Router } from 'express';
import { createOrder, getOrders } from '../controllers/orders.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();
router.use(authenticate);
router.post('/', createOrder);
router.get('/', getOrders);
export default router;
