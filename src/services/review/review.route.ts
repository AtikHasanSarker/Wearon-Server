import { Router } from "express";
import * as controller from "./review.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, controller.createReview);
router.get("/", controller.getAllReviews);
router.get("/:id", controller.getReviewById);
router.patch("/:id", authenticate, controller.updateReview);
router.delete("/:id", authenticate, controller.deleteReview);

export default router;
