import express from "express";
import expensesRoutes from "./modules/expenses/expenses.route";
import budgetRoutes from "./modules/budget/budget.route";
import financialRoutes from "./modules/financialReport/financial.route";
const router = express.Router();

router.use('/expenses', expensesRoutes);
router.use('/budgets', budgetRoutes);
router.use('/financial', financialRoutes);


export default router;