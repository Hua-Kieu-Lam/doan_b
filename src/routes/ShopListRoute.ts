import express from 'express';
import ShopListController from '../controllers/ShopListController';
import uploadCloud from "../configs/cloudinary.config";

const router = express.Router()


router.post('/',uploadCloud.single("thumb"), ShopListController.handleCreateShopList);
router.get('/', ShopListController.handleGetShopLists);
router.put('/:sid', ShopListController.handleUpdateShopList);
router.delete('/:sid', ShopListController.handleDeleteShopList);
router.get('/:sid', ShopListController.handleGetShopListById);

export default router