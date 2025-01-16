import { type Response, type Request, type NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

// Middleware to handle validation errors and async errors
export const catchError = expressAsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    // Check for validation errors
    if (!errors.isEmpty()) {
      const data = { errors: errors.array() };
      console.error("Validation Error: ", data); // Log errors for debugging
      throw createHttpError(400, {
        message: "Validation error! Please fix the issues with your request.",
        data,
      });
    }

    // Proceed to the next middleware or route handler
    next();
  }
);
