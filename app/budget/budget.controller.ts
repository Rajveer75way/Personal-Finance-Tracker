import { Request, Response } from "express";
import * as budgetService from "./budget.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";

/**
 * Create a new budget
 * @param {Request} req - The request object, which contains the expense data in the body.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with the created expense or an error message.
 */
export const createBudget = asyncHandler(async (req: Request, res: Response) => {
    const result = await budgetService.createBudget(req.body);
    res.status(201).json(createResponse(result, "Budget created successfully"));
  })

/**
 * Get all budgets
 * @function
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with all expenses or an error message.
 */
export const getAllBudgets = asyncHandler(async (req: Request, res: Response) => {
  const result = await budgetService.getAllBudgets();
  res.status(200).json(createResponse(result, "Budgets retrieved successfully"));
})

/**
 * Get a budget by ID
 * @function
 * @param {Request} req - The request object, which contains the expense ID in the params.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with the expense or an error message.
 */
export const getBudgetById = asyncHandler(async (req: Request, res: Response) => {
  const result = await budgetService.getBudgetById(req.params.id);
  res.status(200).json(createResponse(result, "Budget retrieved successfully"));
});

/**
 * Update a budget by ID
 * @function
 * @param {Request} req - The request object, which contains the expense ID in the params and the updated expense data in the body.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with the updated expense or an error message.
 */
export const updateBudget = asyncHandler(async (req: Request, res: Response) => {
  const result = await budgetService.updateBudget(req.params.id, req.body);
  res.status(200).json(createResponse(result, "Budget updated successfully"));
});

/**
 * Delete a budget by ID
 * @function
 * @param {Request} req - The request object, which contains the expense ID in the params.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with the result or an error message.
 */
export const deleteBudget = asyncHandler( async (req: Request, res: Response) => {
  const result = await budgetService.deleteBudget(req.params.id);
  res.status(200).json(createResponse(result, "Budget deleted successfully"));
});

/**
 * Get budgets by category and date range
 * @function
 * @param {Request} req - The request object, which contains the category and date range in the body.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with the result or an error message.
 */
export const getBudgetsByCategoryAndDateRange = asyncHandler(async (req: Request, res: Response) => {
  const { category, startDate, endDate } = req.body;
  const budgets = await budgetService.getBudgetsByCategoryAndDateRange(
    category as string,
    new Date(startDate as string),
    new Date(endDate as string)
  );
 });

