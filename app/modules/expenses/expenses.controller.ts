import { Request, Response } from "express";
import * as expenseService from "./expenses.service";
import { createResponse } from "../../common/helper/response.hepler"; // Adjust the path if needed
// import 
// Create a new expense
export const createExpense = async (req: Request, res: Response) => {
  try {
    const result = await expenseService.createExpense(req.body);
    res.status(201).json(createResponse(result, "Expense created successfully"));
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error_code: 400,
        message: error.message || "Something went wrong",
        data: null,
      });
    } else {
      res.status(400).json({
        success: false,
        error_code: 400,
        message: "An unexpected error occurred",
        data: null,
      });
    }
  }
};

// Get all expenses
export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const result = await expenseService.getAllExpenses();
    res.status(200).json(createResponse(result, "Expenses retrieved successfully"));
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      error_code: 400,
      message: "Failed to retrieve expenses",
      data: null,
    });
  }
};

// Get a single expense by ID
export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const result = await expenseService.getExpenseById(req.params.id);
    res.status(200).json(createResponse(result, "Expense retrieved successfully"));
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Expense not found") {
      res.status(404).json({
        success: false,
        error_code: 404,
        message: "Expense with the provided ID not found",
        data: null,
      });
    } else {
      res.status(400).json({
        success: false,
        error_code: 400,
        message: "Failed to retrieve the expense",
        data: null,
      });
    }
  }
};

// Update an existing expense by ID
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const result = await expenseService.updateExpense(req.params.id, req.body);
    res.status(200).json(createResponse(result, "Expense updated successfully"));
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Expense not found") {
      res.status(404).json({
        success: false,
        error_code: 404,
        message: "Expense with the provided ID not found",
        data: null,
      });
    } else {
      res.status(400).json({
        success: false,
        error_code: 400,
        message: "Failed to update the expense",
        data: null,
      });
    }
  }
};

// Delete an expense by ID
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const result = await expenseService.deleteExpense(req.params.id);
    res.status(200).json(createResponse(result, "Expense deleted successfully"));
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Expense not found") {
      res.status(404).json({
        success: false,
        error_code: 404,
        message: "Expense with the provided ID not found",
        data: null,
      });
    } else {
      res.status(400).json({
        success: false,
        error_code: 400,
        message: "Failed to delete the expense",
        data: null,
      });
    }
  }
};

// Get total expenses by category within a specific date range
export const getExpensesByAllCategoryAndDateRange = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;
    console.log(startDate, endDate);
  // Ensure the query parameters are provided
  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      error_code: 400,
      message: "Start date and end date are required",
      data: null,
    });
  }

  try {
    const result = await expenseService.getExpensesByCategory(startDate as string, endDate as string);
    res.status(200).json(createResponse(result, "Expenses aggregated by category successfully"));
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      error_code: 400,
      message: "Failed to retrieve categorized expenses",
      data: null,
    });
  }
};
// Controller method to get expenses by category and date range
export const getExpensesByParticularCategoryAndDateRange = async (req: Request, res: Response) => {
    try {
      const { category, startDate, endDate } = req.body;
  
      if (!category || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Category and both startDate and endDate are required.",
          data: null,
        });
      }
  
      const expenses = await expenseService.getExpensesByCategoryAndDateRange(
        category as string,
        new Date(startDate as string),
        new Date(endDate as string)
      );
  
      res.status(200).json(createResponse(expenses, "Expenses retrieved successfully"));
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error_code: 400,
          message: error.message || "Something went wrong",
          data: null,
        });
      } else {
        res.status(400).json({
          success: false,
          error_code: 400,
          message: "An unexpected error occurred.",
          data: null,
        });
      }
    }
  };
  
  // Controller to handle the request
  export const getSpendingTrends = async (req: Request, res: Response) => {
    const { category, startDate, endDate } = req.body;
  
    // Ensure category and dates are provided
    if (!category || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error_code: 400,
        message: "Category, startDate and endDate are required",
        data: null,
      });
    }
  
    try {
      // Get the spending trends from the service
      const trends = await expenseService.getSpendingTrendsWithAI(String(category), new Date(startDate), new Date(endDate));
  
      // Send back the response
      res.status(200).json({
        success: true,
        message: "Spending trends retrieved successfully",
        data: trends,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error_code: 500,
        message: "Internal server error",
        data: null,
      });
    }
  };