import express from 'express';
import ShopListController from '../controllers/ShopListController';

const router = express.Router()

router.post('/', ShopListController.handleCreateShopList);
router.get('/', ShopListController.handleGetShopLists);
router.put('/:sid', ShopListController.handleUpdateShopList);
router.delete('/:sid', ShopListController.handleDeleteShopList);

export default router