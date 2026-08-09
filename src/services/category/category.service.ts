import prisma from "../../lib/prisma";

export async function createCategory(data: { name: string; description?: string }) {
  return prisma.category.create({
    data: {
      name: data.name,
      description: data.description ?? null,
    },
    select: {
      id: true,
      name: true,
      description: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateCategory(id: string, data: { name?: string; description?: string }) {
  const updateData: any = {};
  if (typeof data.name === "string") updateData.name = data.name;
  if (typeof data.description === "string") updateData.description = data.description;

  return prisma.category.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function softDeleteCategory(id: string) {
  return prisma.category.update({
    where: { id },
    data: { isDeleted: true },
    select: { id: true },
  });
}
