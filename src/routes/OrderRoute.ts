import express from 'express';
import OrderController from '../controllers/OrderController';
import { verifyJWT } from '../middlewares/verifyJWT';

const router = express.Router()

router.post('/', [verifyJWT], OrderController.handleCreateOrder);
router.get('/user-order', [verifyJWT], OrderController.handleGetOrderByUser); 
router.get('/', [verifyJWT], OrderController.handleGetOrderByAdmin);
router.put('/update-status/:oid',[verifyJWT], OrderController.handleUpdateStatusOrder);

export default router