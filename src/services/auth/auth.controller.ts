import { Request, Response } from "express";
import * as authService from "./auth.service";

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
