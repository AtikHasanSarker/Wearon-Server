import { Request, Response } from "express";
import * as orderService from "./order.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

const buildResponse = (success: boolean, message: string, data: Record<string, unknown> = {}) => ({
  success,
  message,
  data,
});

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json(buildResponse(false, "Unauthorized"));

    const { quantity, productId } = req.body;
    if (typeof quantity === "undefined" || !productId) return res.status(400).json(buildResponse(false, "quantity and productId are required"));

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) return res.status(400).json(buildResponse(false, "quantity must be an integer greater than 0"));

    try {
      const order = await orderService.createOrder({ userId, productId, quantity: qty });
      return res.status(201).json(buildResponse(true, "Order created", { order }));
    } catch (err: any) {
      if (err.message === "Product not found") return res.status(400).json(buildResponse(false, "Product not found"));
      if (err.message === "Insufficient stock") return res.status(400).json(buildResponse(false, "Insufficient stock"));
      throw err;
    }
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to create order"));
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json(buildResponse(false, "Unauthorized"));

    const orders = await orderService.getOrdersByUser(userId);
    return res.json(buildResponse(true, "Orders retrieved", { orders }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to fetch orders"));
  }
};

export const getOrderById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json(buildResponse(false, "Unauthorized"));

    const { id } = req.params;
    const order = await orderService.getOrderById(id as string);
    if (!order || (order as any).isDeleted) return res.status(404).json(buildResponse(false, "Order not found"));
    if ((order as any).userId !== userId) return res.status(403).json(buildResponse(false, "Forbidden"));

    return res.json(buildResponse(true, "Order retrieved", { order }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to fetch order"));
  }
};

export const updateOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json(buildResponse(false, "Unauthorized"));

    const { id } = req.params;
    const { status } = req.body;

    const order = await orderService.getOrderById(id as string);
    if (!order || (order as any).isDeleted) return res.status(404).json(buildResponse(false, "Order not found"));
    if ((order as any).userId !== userId) return res.status(403).json(buildResponse(false, "Forbidden"));

    if (typeof status === "undefined") return res.status(400).json(buildResponse(false, "status is required"));
    if (!ORDER_STATUSES.includes(status)) return res.status(400).json(buildResponse(false, "Invalid status"));

    const updated = await orderService.updateOrderStatus(id as string, status);
    return res.json(buildResponse(true, "Order updated", { order: updated }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to update order"));
  }
};

export const deleteOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json(buildResponse(false, "Unauthorized"));

    const { id } = req.params;
    const order = await orderService.getOrderById(id as string);
    if (!order || (order as any).isDeleted) return res.status(404).json(buildResponse(false, "Order not found"));
    if ((order as any).userId !== userId) return res.status(403).json(buildResponse(false, "Forbidden"));

    await orderService.softDeleteOrder(id as string);
    return res.json(buildResponse(true, "Order deleted"));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to delete order"));
  }
};
