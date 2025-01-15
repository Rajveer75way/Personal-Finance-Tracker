import { type ITask } from "./task.dto";
import TaskSchema from "./task.schema";
import createHttpError from "http-errors";  // If you want to manually throw HTTP errors in the service layer

// Create a new task
export const createTask = async (task: ITask) => {
    const newTask = new TaskSchema(task);
    return newTask.save();  // Directly return the result
}

// Get tasks by user ID (tasks assigned to a specific user)
export const getTasksByUser = async (userId: string) => {
    const tasks = await TaskSchema.find({ assignedTo: userId }).exec();
    return tasks;
}

// Get a task by its ID
export const getTaskById = async (taskId: string) => {
    console.log(taskId);
    const task = await TaskSchema.findById(taskId).exec();
    console.log(task);
    return task;
}

// Update the status of a task
export const updateTaskStatus = async (taskId: string, status: string) => {
    const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];
    if (!validStatuses.includes(status)) {
        throw createHttpError(400, "Invalid status");  // Return an error if the status is invalid
    }

    const updatedTask = await TaskSchema.findByIdAndUpdate(
        taskId,
        { status },
        { new: true }  // Return the updated task
    ).exec();

    return updatedTask;  // Return the updated task
}
