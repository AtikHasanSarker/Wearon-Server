import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";

export default function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Default response
  let status = 500;
  let message = "Something went wrong";

  // Prisma known request error (e.g., unique constraint)
  if (err && typeof err === "object") {
    const e = err as any;
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle common Prisma error codes
      if (e.code === "P2002") {
        status = 409; // Unique constraint failed
        message = "Unique constraint failed";
      } else if (e.code === "P2025") {
        status = 404; // Record not found
        message = "Resource not found";
      } else {
        status = 400;
        message = "Database error";
      }
    } else if (e instanceof Prisma.PrismaClientValidationError) {
      status = 400;
      message = "Invalid request";
    } else if (e && e.name === "ValidationError") {
      status = 400;
      message = (e.message as string) || message;
    } else if (e && e.status && typeof e.status === "number" && e.message) {
      // Custom thrown error-like object
      status = e.status;
      message = e.message;
    } else if (e instanceof Error) {
      // Generic Error
      message = e.message || message;
    }
  }

  // In non-production, log full error for debugging
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({ success: false, message });
}
