import "dotenv/config";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import type { UserRole } from "../generated/prisma/client";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing",
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (typeof payload === "string" || !payload.id || !payload.role) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = {
      id: String(payload.id),
      role: payload.role as UserRole,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
