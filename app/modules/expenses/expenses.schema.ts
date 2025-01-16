import mongoose from "mongoose";
import { IExpense } from "./expenses.dto";

const ExpenseSchema = new mongoose.Schema<IExpense>(
  {
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
