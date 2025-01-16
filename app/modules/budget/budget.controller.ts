import { Request, Response } from "express";
import * as budgetService from "./budget.service";
import { createResponse } from "../../common/helper/response.hepler";

export const createBudget = async (req: Request, res: Response) => {
  try {
    const result = await budgetService.createBudget(req.body);
    res.status(201).json(createResponse(result, "Budget created successfully"));
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

export const getAllBudgets = async (req: Request, res: Response) => {
  const result = await budgetService.getAllBudgets();
  res.status(200).json(createResponse(result, "Budgets retrieved successfully"));
};

export const getBudgetById = async (req: Request, res: Response) => {
  const result = await budgetService.getBudgetById(req.params.id);
  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Budget not found.",
      data: null,
    });
  }
  res.status(200).json(createResponse(result, "Budget retrieved successfully"));
};

export const updateBudget = async (req: Request, res: Response) => {
  const result = await budgetService.updateBudget(req.params.id, req.body);
  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Budget not found.",
      data: null,
    });
  }
  res.status(200).json(createResponse(result, "Budget updated successfully"));
};

export const deleteBudget = async (req: Request, res: Response) => {
  const result = await budgetService.deleteBudget(req.params.id);
  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Budget not found.",
      data: null,
    });
  }
  res.status(200).json(createResponse(result, "Budget deleted successfully"));
};

export const getBudgetsByCategoryAndDateRange = async (req: Request, res: Response) => {
  const { category, startDate, endDate } = req.body;
  if (!category || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Category and both startDate and endDate are required.",
      data: null,
    });
  }
  const budgets = await budgetService.getBudgetsByCategoryAndDateRange(
    category as string,
    new Date(startDate as string),
    new Date(endDate as string)
  );
  res.status(200).json(createResponse(budgets, "Budgets retrieved successfully"));
};
