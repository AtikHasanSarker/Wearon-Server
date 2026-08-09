import prisma from "../../lib/prisma";
import type { ProductStatus } from "../../generated/prisma/client";

export async function createProduct(data: {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  categoryId: string;
  userId: string;
  status?: ProductStatus | null;
}) {
  let statusValue: ProductStatus | undefined = undefined;
  if (typeof data.status === "string") {
    const s = data.status as ProductStatus;
    if (s === "ACTIVE" || s === "INACTIVE" || s === "OUT_OF_STOCK") statusValue = s;
  }

  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      price: Math.floor(data.price),
      stock: Math.floor(data.stock),
      category: { connect: { id: data.categoryId } },
      user: { connect: { id: data.userId } },
      status: statusValue ?? undefined,
    },
    include: {
      category: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });
}

export async function getAllProducts() {
  return prisma.product.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, description: true } },
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });
}

export async function updateProduct(id: string, data: {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
  status?: ProductStatus | null;
  categoryId?: string;
}) {
  const updateData: any = {};
  if (typeof data.name === "string") updateData.name = data.name;
  if (typeof data.description === "string") updateData.description = data.description;
  if (typeof data.price === "number") updateData.price = Math.floor(data.price);
  if (typeof data.stock === "number") updateData.stock = Math.floor(data.stock);
  if (typeof data.status === "string") {
    const s = data.status as ProductStatus;
    if (s === "ACTIVE" || s === "INACTIVE" || s === "OUT_OF_STOCK") updateData.status = s;
  }
  if (typeof data.categoryId === "string") updateData.category = { connect: { id: data.categoryId } };

  return prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });
}

export async function softDeleteProduct(id: string) {
  return prisma.product.update({ where: { id }, data: { isDeleted: true }, select: { id: true } });
}
