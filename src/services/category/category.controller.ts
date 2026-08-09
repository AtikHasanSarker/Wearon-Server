import { Request, Response } from "express";
import * as categoryService from "./category.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

const buildResponse = (success: boolean, message: string, data: Record<string, unknown> = {}) => ({
  success,
  message,
  data,
});

export const createCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json(buildResponse(false, "Name is required"));
    }

    const category = await categoryService.createCategory({ name, description });
    return res.status(201).json(buildResponse(true, "Category created", { category }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to create category"));
  }
};

export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.json(buildResponse(true, "Categories retrieved", { categories }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to fetch categories"));
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    if (!category || (category as any).isDeleted) {
      return res.status(404).json(buildResponse(false, "Category not found"));
    }
    const { isDeleted, ...safeCategory } = category as any;
    return res.json(buildResponse(true, "Category retrieved", { category: safeCategory }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to fetch category"));
  }
};

export const updateCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await categoryService.getCategoryById(id);
    if (!category || (category as any).isDeleted) {
      return res.status(404).json(buildResponse(false, "Category not found"));
    }

    const updated = await categoryService.updateCategory(id, { name, description });
    return res.json(buildResponse(true, "Category updated", { category: updated }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to update category"));
  }
};

export const deleteCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    if (!category || (category as any).isDeleted) {
      return res.status(404).json(buildResponse(false, "Category not found"));
    }

    await categoryService.softDeleteCategory(id);
    return res.json(buildResponse(true, "Category deleted"));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to delete category"));
  }
};
