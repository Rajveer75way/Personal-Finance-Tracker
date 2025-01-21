import express from "express";
import expensesRoutes from "./expenses/expenses.route";
import budgetRoutes from "./budget/budget.route";
import financialRoutes from "./financeReport/finance.route";
import userRoutes from './user/user.route'
const router = express.Router();

router.use('/expenses', expensesRoutes);
router.use('/budgets', budgetRoutes);
router.use('/financial', financialRoutes);
router.use('/users', userRoutes)


export default router;