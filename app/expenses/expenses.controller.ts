import { Request, Response } from "express";
import * as expenseService from "./expenses.service";
import { createResponse } from "../common/helper/response.hepler"; // Adjust the path if needed
import asyncHandler from "express-async-handler"; // Import express-async-handler

/**
 * Create a new expense
 * @param {Request} req - The request object, which contains the expense data in the body.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with the created expense or an error message.
 */
export const createExpense = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await expenseService.createExpense(req.body); // Call service to create expense
    res
      .status(201)
      .json(createResponse(result, "Expense created successfully")); // Return success response
  }
);

/**
 * Get all expenses
 * @function
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with all expenses or an error message.
 */
export const getAllExpenses = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await expenseService.getAllExpenses();
    res
      .status(200)
      .json(createResponse(result, "Expenses retrieved successfully"));
  }
);

/**
 * Get a single expense by ID
 * @function
 * @param {Request} req - The request object, which contains the expense ID in the params.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with the expense or an error message.
 */
export const getExpenseById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await expenseService.getExpenseById(req.params.id);
    res
      .status(200)
      .json(createResponse(result, "Expense retrieved successfully"));
  }
);

/**
 * Update an existing expense by ID
 * @function
 * @param {Request} req - The request object, which contains the expense ID in the params.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with the updated expense or an error message.
 */
export const updateExpense = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await expenseService.updateExpense(req.params.id, req.body);
    res
      .status(200)
      .json(createResponse(result, "Expense updated successfully"));
  }
);

/**
 * Delete an expense by ID
 * @function
 * @param {Request} req - The request object, which contains the expense ID in the params.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with the result or an error message.
 */
export const deleteExpense = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await expenseService.deleteExpense(req.params.id);
    res
      .status(200)
      .json(createResponse(result, "Expense deleted successfully"));
  }
);

/**
 * Get total expenses by category within a specific date range
 * @function
 * @param {Request} req - The request object, which contains the start and end dates in the body.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with the result or an error message.
 */
export const getExpensesByAllCategoryAndDateRange = asyncHandler(
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.body;
    const result = await expenseService.getExpensesByCategory(
      startDate as string,
      endDate as string
    );
    res
      .status(200)
      .json(
        createResponse(result, "Expenses aggregated by category successfully")
      );
  }
);

/**
 * Get expenses by category and date range
 * @function
 * @param {Request} req - The request object, which contains the category, start date, and end date in the body.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with the result or an error message.
 */
export const getExpensesByParticularCategoryAndDateRange = asyncHandler(
  async (req: Request, res: Response) => {
    const { category, startDate, endDate } = req.body;
    const expenses = await expenseService.getExpensesByCategoryAndDateRange(
      category as string,
      new Date(startDate as string),
      new Date(endDate as string)
    );
    res
      .status(200)
      .json(createResponse(expenses, "Expenses retrieved successfully"));
  }
);

/**
 * Get spending trends
 * @function
 * @param {Request} req - The request object, which contains the category, start date, and end date in the body.
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} Returns a JSON response with the result or an error message.
 */
export const getSpendingTrends = asyncHandler(
  async (req: Request, res: Response) => {
    const { category, startDate, endDate } = req.body;
    const trends = await expenseService.getSpendingTrendsWithAI(
      String(category),
      new Date(startDate),
      new Date(endDate)
    );
    res
      .status(200)
      .json(createResponse(trends,"Spending trends retrieved successfully"));
  }
);
