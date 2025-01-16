import mongoose from "mongoose";
import { IBudget } from "./budget.dto";

const BudgetSchema = new mongoose.Schema<IBudget>(
  {
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IBudget>("Budget", BudgetSchema);
