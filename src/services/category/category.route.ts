import { Router } from "express";
import * as controller from "./category.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, controller.createCategory);
router.get("/", controller.getAllCategories);
router.get("/:id", controller.getCategoryById);
router.patch("/:id", authenticate, controller.updateCategory);
router.delete("/:id", authenticate, controller.deleteCategory);

export default router;
