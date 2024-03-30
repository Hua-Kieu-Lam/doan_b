import express from 'express';
import CategoryController from '../controllers/CategoryController';

const router = express.Router()

router.post('/', CategoryController.handleCreateCategory);
router.get('/', CategoryController.handleGetCategories);
router.put('/:cid', CategoryController.handleUpdateCategory);
router.delete('/:cid', CategoryController.handleDeleteCategory);

export default router