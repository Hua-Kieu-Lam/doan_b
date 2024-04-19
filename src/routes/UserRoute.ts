import express from 'express';
import UserController from '../controllers/UserController';
import { verifyJWT } from "../middlewares/verifyJWT";

const router = express.Router()

router.post('/', UserController.handleCreateCurrentUser)
router.post('/create', UserController.handleRegister);
router.post('/login', UserController.handleLogin);
router.put('/update',verifyJWT, UserController.handleUpdateUser);
router.get('/current', verifyJWT, UserController.handleGetUserCurrent);
router.get("/", [verifyJWT], UserController.handleGetAllUser);
router.put("/update-address", verifyJWT, UserController.handleUpdateAddress);
router.put("/update-cart", verifyJWT, UserController.handleUpdateCart);
router.put('/update-by-admin/:uid',verifyJWT, UserController.handleUpdateUserByAdmin); // kiem tra la admin
router.delete('/delete/:uid', UserController.handleDeleteUser);
router.delete(
    "/remove-cart/:pid/:color",
    [verifyJWT],
    UserController.handleRemoveInCart
  );


export default router