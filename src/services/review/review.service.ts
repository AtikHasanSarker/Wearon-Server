import prisma from "../../lib/prisma";

export async function findReviewByUserAndProduct(userId: string, productId: string) {
  return prisma.review.findFirst({
    where: { userId, productId },
  });
}

export async function createReview(data: { rating: number; comment?: string | null; userId: string; productId: string }) {
  return prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment ?? null,
      user: { connect: { id: data.userId } },
      product: { connect: { id: data.productId } },
    },
    include: {
      user: { select: { id: true, name: true } },
      product: { select: { id: true, name: true } },
    },
  });
}

export async function getAllReviews() {
  return prisma.review.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true } },
      product: { select: { id: true, name: true } },
    },
  });
}

export async function getReviewById(id: string) {
  return prisma.review.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true } },
      product: { select: { id: true, name: true } },
    },
  });
}

export async function updateReview(id: string, data: { rating?: number; comment?: string | null }) {
  const updateData: any = {};
  if (typeof data.rating === "number") updateData.rating = data.rating;
  if (typeof data.comment === "string") updateData.comment = data.comment;

  return prisma.review.update({
    where: { id },
    data: updateData,
    include: {
      user: { select: { id: true, name: true } },
      product: { select: { id: true, name: true } },
    },
  });
}

export async function softDeleteReview(id: string) {
  return prisma.review.update({ where: { id }, data: { isDeleted: true }, select: { id: true } });
}
