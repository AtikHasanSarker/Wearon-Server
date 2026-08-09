import prisma from "../../lib/prisma";
import type { OrderStatus } from "../../generated/prisma/client";

export async function createOrder(data: { userId: string; productId: string; quantity: number }) {
  const { userId, productId, quantity } = data;

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product || product.isDeleted) {
      throw new Error("Product not found");
    }
    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    const totalPrice = product.price * quantity;

    const order = await tx.order.create({
      data: {
        quantity,
        totalPrice,
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
      },
      include: {
        product: { select: { id: true, name: true, price: true } },
      },
    });

    await tx.product.update({ where: { id: productId }, data: { stock: product.stock - quantity } });

    return order;
  });
}

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId, isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: { product: { select: { id: true, name: true, price: true } } },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { product: { select: { id: true, name: true, price: true } }, user: { select: { id: true } } },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({ where: { id }, data: { status }, include: { product: { select: { id: true, name: true, price: true } } } });
}

export async function softDeleteOrder(id: string) {
  return prisma.order.update({ where: { id }, data: { isDeleted: true }, select: { id: true } });
}
