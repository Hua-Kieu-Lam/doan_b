import express from 'express';
import RoleController from '../controllers/RoleController';

const router = express.Router()

router.post('/', RoleController.handleCreateRole);
router.get('/', RoleController.handleGetRoles);
router.put('/:rid', RoleController.handleUpdateRole);
router.delete('/:rid', RoleController.handleDeleteRole);

export default router