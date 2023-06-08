import { Router } from "express";
import authMiddleware from "../middleware/auth.mddl.js";
import ProductController from "../controller/product.contr.js";

const productRouter = Router();

productRouter.get("/products", ProductController.getProduct);
productRouter.get("/products/:id", ProductController.getProduct);
productRouter.post("/products", authMiddleware, ProductController.addProduct);
productRouter.put(
  "/products/:product_id",
  authMiddleware,
  ProductController.updateProduct
);
productRouter.delete(
  "/products/:product_id",
  authMiddleware,
  ProductController.deleteProduct
);

export default productRouter;
