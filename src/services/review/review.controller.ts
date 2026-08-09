import { Request, Response } from "express";
import * as reviewService from "./review.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import prisma from "../../lib/prisma";

const buildResponse = (success: boolean, message: string, data: Record<string, unknown> = {}) => ({
  success,
  message,
  data,
});

export const createReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json(buildResponse(false, "Unauthorized"));

    const { rating, comment, productId } = req.body;
    if (typeof rating === "undefined") return res.status(400).json(buildResponse(false, "rating is required"));

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json(buildResponse(false, "rating must be an integer between 1 and 5"));
    }

    if (!productId) return res.status(400).json(buildResponse(false, "productId is required"));

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.isDeleted) return res.status(400).json(buildResponse(false, "Product not found"));

    const existing = await reviewService.findReviewByUserAndProduct(userId, productId);
    if (existing) return res.status(409).json(buildResponse(false, "Review already exists for this product by the user"));

    const review = await reviewService.createReview({ rating: ratingNum, comment, userId, productId });
    return res.status(201).json(buildResponse(true, "Review created", { review }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to create review"));
  }
};

export const getAllReviews = async (_req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getAllReviews();
    return res.json(buildResponse(true, "Reviews retrieved", { reviews }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to fetch reviews"));
  }
};

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) return res.status(400).json(buildResponse(false, "Invalid id"));
    const review = await reviewService.getReviewById(id);
    if (!review || (review as any).isDeleted) return res.status(404).json(buildResponse(false, "Review not found"));
    return res.json(buildResponse(true, "Review retrieved", { review }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to fetch review"));
  }
};

export const updateReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json(buildResponse(false, "Unauthorized"));

    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) return res.status(400).json(buildResponse(false, "Invalid id"));
    const { rating, comment } = req.body;

    const review = await reviewService.getReviewById(id);
    if (!review || (review as any).isDeleted) return res.status(404).json(buildResponse(false, "Review not found"));

    if ((review as any).user?.id !== userId) return res.status(403).json(buildResponse(false, "Forbidden"));

    const updateData: any = {};
    if (typeof rating !== "undefined") {
      const ratingNum = Number(rating);
      if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json(buildResponse(false, "rating must be an integer between 1 and 5"));
      }
      updateData.rating = ratingNum;
    }
    if (typeof comment === "string") updateData.comment = comment;

    const updated = await reviewService.updateReview(id as string, updateData);
    return res.json(buildResponse(true, "Review updated", { review: updated }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to update review"));
  }
};

export const deleteReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json(buildResponse(false, "Unauthorized"));

    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) return res.status(400).json(buildResponse(false, "Invalid id"));
    const review = await reviewService.getReviewById(id);
    if (!review || (review as any).isDeleted) return res.status(404).json(buildResponse(false, "Review not found"));

    if ((review as any).user?.id !== userId) return res.status(403).json(buildResponse(false, "Forbidden"));

    await reviewService.softDeleteReview(id as string);
    return res.json(buildResponse(true, "Review deleted"));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to delete review"));
  }
};
