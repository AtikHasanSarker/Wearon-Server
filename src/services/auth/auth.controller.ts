import { Request, Response } from "express";
import * as authService from "./auth.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

const buildResponse = (success: boolean, message: string, data: Record<string, unknown> = {}) => ({
  success,
  message,
  data,
});

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json(
        buildResponse(false, "Name, email, and password are required")
      );
    }

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json(
        buildResponse(false, "Email already registered")
      );
    }

    const user = await authService.createUser({ name, email, password });

    return res.status(201).json(
      buildResponse(true, "Registration successful", { user })
    );
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Registration failed"));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(buildResponse(false, "Email and password are required"));
    }

    const user = await authService.findUserByEmail(email);
    if (!user || (user as any).isDeleted) {
      return res.status(401).json(buildResponse(false, "Invalid email or password"));
    }

    const passwordMatches = await authService.verifyPassword(password, (user as any).password);
    if (!passwordMatches) {
      return res.status(401).json(buildResponse(false, "Invalid email or password"));
    }

    const token = authService.generateToken({ id: (user as any).id, role: (user as any).role });

    const safeUser = {
      id: (user as any).id,
      name: (user as any).name,
      email: (user as any).email,
      role: (user as any).role,
    };

    return res.json(buildResponse(true, "Login successful", { user: safeUser, token }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Login failed"));
  }
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json(buildResponse(false, "Unauthorized"));
    }

    const user = await authService.findUserById(userId);
    if (!user || user.isDeleted) {
      return res.status(404).json(buildResponse(false, "User not found"));
    }

    const { isDeleted, ...safeUser } = user as any;

    return res.json(buildResponse(true, "User retrieved successfully", { user: safeUser }));
  } catch (error) {
    return res.status(500).json(buildResponse(false, "Failed to retrieve user"));
  }
};
