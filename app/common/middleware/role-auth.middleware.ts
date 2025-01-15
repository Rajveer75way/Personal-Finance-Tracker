import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import process from "process";
import { type IUser } from "../../user/user.dto";

// This middleware will handle both authentication and role-based authorization
export const roleAuth = (
  roles: IUser['role'][],   // Array of roles (like ['USER', 'ADMIN'])
  publicRoutes: string[] = []  // Routes that are public and don't require role checks
) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // Allow access to public routes
      if (publicRoutes.includes(req.path)) {
        return next();
      }

      // Extract token from Authorization header
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        throw createHttpError(401, { message: "Invalid token" });
      }

      try {
        // Verify token and decode it
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as IUser;
        req.user = decodedUser;  // Attach the decoded user to the request object

        // Ensure that the user has a valid role
        const user = req.user as IUser;
        if (!user.role || !['ADMIN', 'USER'].includes(user.role)) {
          throw createHttpError(401, { message: "Invalid user role" });
        }

        // Check if the user's role matches the required roles
        if (!roles.includes(user.role)) {
          const formattedRole = user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
          throw createHttpError(401, { message: `${formattedRole} cannot access this resource` });
        }

        next();  // If all checks pass, allow the request to proceed
      } catch (error) {
        // Handle token verification errors or other issues
        throw createHttpError(401, { message: "Invalid or expired token" });
      }
    }
  );
