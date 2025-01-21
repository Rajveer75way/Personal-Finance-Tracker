import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import process from "process";
import { type IUser } from "../../user/user.dto";

export const roleAuth = (
  roles: IUser['role'][],   
  publicRoutes: string[] = []  
) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (publicRoutes.includes(req.path)) {
        return next();
      }
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        throw createHttpError(401, { message: "Invalid token" });
      }
      try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as IUser;
        req.user = decodedUser;  
        const user = req.user as IUser;
        if (!user.role || !['ADMIN', 'USER'].includes(user.role)) {
          throw createHttpError(401, { message: "Invalid user role" });
        }
        if (!roles.includes(user.role)) {
          const formattedRole = user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
          throw createHttpError(401, { message: `${formattedRole} cannot access this resource` });
        }
        next();  
      } catch (error) {
        throw createHttpError(401, { message: "Invalid or expired token" });
      }
    }
  );
