import { Router } from "express";
import * as budgetController from "./budget.controller";
import { validateBudget } from "./budget.validation";
import { catchError } from "../common/middleware/cath-error.middleware";

const router = Router();
router
    .post("/", validateBudget, catchError, budgetController.createBudget)
    .get("/", catchError, budgetController.getAllBudgets)
    .get("/:id", catchError, budgetController.getBudgetById)
    .put("/:id", validateBudget, catchError, budgetController.updateBudget)
    .delete("/:id", catchError, budgetController.deleteBudget)
    .post("/particular-category-date", catchError, budgetController.getBudgetsByCategoryAndDateRange)

export default router;
