import { Request, Response } from "express";
import * as productService from "./product.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import prisma from "../../lib/prisma";

const buildResponse = (success: boolean, message: string, data: Record<string, unknown> = {}) => ({
  success,
  message,
  data,
});

export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json(buildResponse(false, "Unauthorized"));

    const { name, description, price, stock, categoryId, status } = req.body;

    if (!name || typeof price === "undefined" || typeof stock === "undefined" || !categoryId) {
      return res.status(400).json(buildResponse(false, "name, price, stock and categoryId are required"));
    }

    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (!isFinite(priceNum) || priceNum <= 0) {
      return res.status(400).json(buildResponse(false, "price must be a positive number"));
    }
    if (!Number.isFinite(stockNum) || stockNum < 0) {
      return res.status(400).json(buildResponse(false, "stock must be a non-negative number"));
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category || category.isDeleted) {
      return res.status(400).json(buildResponse(false, "Category not found"));
    }

    const product = await productService.createProduct({
      name,
      description,
      price: priceNum,
      stock: stockNum,
      categoryId,
      userId,
      status,
    });

    return res.status(201).json(buildResponse(true, "Product created", { product }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to create product"));
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    return res.json(buildResponse(true, "Products retrieved", { products }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to fetch products"));
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product || (product as any).isDeleted) {
      return res.status(404).json(buildResponse(false, "Product not found"));
    }
    return res.json(buildResponse(true, "Product retrieved", { product }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to fetch product"));
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, status, categoryId } = req.body;

    const product = await productService.getProductById(id as string);
    if (!product || (product as any).isDeleted) {
      return res.status(404).json(buildResponse(false, "Product not found"));
    }

    if (typeof categoryId === "string") {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category || category.isDeleted) {
        return res.status(400).json(buildResponse(false, "Category not found"));
      }
    }

    const updateData: any = {};
    if (typeof name === "string") updateData.name = name;
    if (typeof description === "string") updateData.description = description;
    if (typeof price !== "undefined") {
      const priceNum = Number(price);
      if (!isFinite(priceNum) || priceNum <= 0) return res.status(400).json(buildResponse(false, "price must be a positive number"));
      updateData.price = priceNum;
    }
    if (typeof stock !== "undefined") {
      const stockNum = Number(stock);
      if (!Number.isFinite(stockNum) || stockNum < 0) return res.status(400).json(buildResponse(false, "stock must be a non-negative number"));
      updateData.stock = stockNum;
    }
    if (typeof status === "string") updateData.status = status;
    if (typeof categoryId === "string") updateData.category = { connect: { id: categoryId } };

    const updated = await productService.updateProduct(id as string, updateData);
    return res.json(buildResponse(true, "Product updated", { product: updated }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to update product"));
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id as string);
    if (!product || (product as any).isDeleted) {
      return res.status(404).json(buildResponse(false, "Product not found"));
    }

    await productService.softDeleteProduct(id as string);
    return res.json(buildResponse(true, "Product deleted"));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to delete product"));
  }
};
