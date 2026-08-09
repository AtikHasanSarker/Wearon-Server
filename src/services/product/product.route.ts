import { Router } from "express";
import * as controller from "./product.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, controller.createProduct);
router.get("/", controller.getAllProducts);
router.get("/:id", controller.getProductById);
router.patch("/:id", authenticate, controller.updateProduct);
router.delete("/:id", authenticate, controller.deleteProduct);

export default router;
