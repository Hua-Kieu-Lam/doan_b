import express from 'express';
import ProductController from '../controllers/ProductController';
import { verifyJWT } from '../middlewares/verifyJWT';
import uploadCloud from "../configs/cloudinary.config";

const router = express.Router()

router.post(
    "/",
    [verifyJWT],
    uploadCloud.fields([
      { name: "image", maxCount: 10 },
      { name: "thumb", maxCount: 1 },
    ]),
    ProductController.handleCreateProduct
);
router.get("/", ProductController.handleGetAllProduct);
router.put("/rating", verifyJWT, ProductController.handleRatings);
router.put(
  "/:pid",
  [verifyJWT],
  uploadCloud.fields([
    { name: "image", maxCount: 10 },
    { name: "thumb", maxCount: 1 },
  ]),
  ProductController.handleUpdateProductById
);
router.delete(
  "/:pid",
  [verifyJWT],
  ProductController.handleDeleteProductById
);
router.get("/:pid", ProductController.handleGetProductById);
router.get("/get-product-shop/:sid", ProductController.handleGetProductByShopId);
router.get("/get-product-category/:pid", ProductController.handleGetProductByCategoryId);

export default router