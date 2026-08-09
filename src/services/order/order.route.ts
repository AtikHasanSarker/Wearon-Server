import { Router } from "express";
import * as controller from "./order.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, controller.createOrder);
router.get("/", authenticate, controller.getOrders);
router.get("/:id", authenticate, controller.getOrderById);
router.patch("/:id", authenticate, controller.updateOrder);
router.delete("/:id", authenticate, controller.deleteOrder);

export default router;
