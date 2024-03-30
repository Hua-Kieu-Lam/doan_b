import express from 'express';
import CouponController from '../controllers/CouponController';
import { verifyJWT, isAdmin } from '../middlewares/verifyJWT';

const router = express.Router()

router.post('/',[verifyJWT,isAdmin], CouponController.handleCreateCoupon);
router.get('/',[verifyJWT,isAdmin], CouponController.handleGetAllCoupon);
router.put('/:cid', CouponController.handleUpdateCouponById);
router.delete('/:cid', CouponController.handleDeleteCouponById);

export default router