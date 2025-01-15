import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware"; // Assuming this is your error handler
import * as taskController from "./task.controller";
import * as taskValidator from "./task.validation";
import { roleAuth } from "../common/middleware/role-auth.middleware"; // Role-based access control middleware

const router = Router();

// Create task (only accessible to admin)
router.post("/create", taskValidator.createTask, roleAuth(['ADMIN']), catchError, taskController.createTask);

// Get tasks for the logged-in user
router.get("/my-tasks", roleAuth(['USER', 'ADMIN']), catchError, taskController.getUserTasks);

// Get task by ID (accessible to admin or the user who created it)
router.get("/:taskId", roleAuth(['USER', 'ADMIN']), taskValidator.getTaskByIdValidation, catchError, taskController.getTaskById);

// Update task status (accessible to the user assigned to the task or admins)
router.patch("/update-status/:taskId", roleAuth(['USER', 'ADMIN']), taskValidator.updateTaskStatus, catchError, taskController.updateTaskStatus);

export default router;
