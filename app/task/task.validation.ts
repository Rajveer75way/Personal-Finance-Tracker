import { body, param } from 'express-validator';

export const createTask = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),

  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string'),

  body('assignedTo')
    .notEmpty().withMessage('Assigned user is required')
    .isMongoId().withMessage('Assigned user must be a valid MongoDB ObjectId'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Status must be one of: TODO, IN_PROGRESS, DONE'),
];

// Validation for getting a task by ID
export const getTaskByIdValidation = [
  param('taskId')
    .notEmpty().withMessage('Task ID is required')
    .isMongoId().withMessage('Task ID must be a valid MongoDB ObjectId'),
];

// Validation for updating task status
export const updateTaskStatus = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Status must be one of: TODO, IN_PROGRESS, DONE'),
];
