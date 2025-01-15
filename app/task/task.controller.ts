import * as TaskService from './task.service';
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express';

// Create task
export const createTask = asyncHandler(async (req: Request, res: Response) => {
    const taskData = req.body;
    const result = await TaskService.createTask(taskData);
    res.send(createResponse(result, "Task created successfully"));
});

// Get user's tasks (tasks assigned to the user)
export const getUserTasks = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;  // Type assertion
    const tasks = await TaskService.getTasksByUser(userId);
    console.log(tasks);
    res.send(createResponse(tasks, "User tasks fetched successfully"));
});


// Get task by ID
export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const task = await TaskService.getTaskById(taskId);
    res.send(createResponse(task, "Task fetched successfully"));
});

// Update task status
export const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { status } = req.body;  // Assuming status is being sent in the request body
    const updatedTask = await TaskService.updateTaskStatus(taskId, status);
    res.send(createResponse(updatedTask, "Task status updated successfully"));
});
