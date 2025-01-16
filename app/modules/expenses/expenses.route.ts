import { Router } from "express";
import { validateExpense } from "./expenses.validation";
import * as expenseController from "./expenses.controller";
import { catchError } from "../../common/middleware/cath-error.middleware";

const router = Router();
router
    .post("/", validateExpense, catchError, expenseController.createExpense)
    .get("/", catchError, expenseController.getAllExpenses)
    .get("/:id", catchError, expenseController.getExpenseById)
    .put("/:id", validateExpense, catchError, expenseController.updateExpense)
    .delete("/:id", catchError, expenseController.deleteExpense)
    .post("/all-category-date", catchError, expenseController.getExpensesByAllCategoryAndDateRange)
    .post("/particular-category-date", catchError, expenseController.getExpensesByParticularCategoryAndDateRange)
    .post("/spending-trends", catchError, expenseController.getSpendingTrends)

export default router;
