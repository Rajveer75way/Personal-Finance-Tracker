import { BaseSchema } from "../common/dto/base.dto";

export interface IBudget extends BaseSchema {
  amount: number;            // The total budgeted amount
  category: string;          // The category of the budget (e.g., "Food", "Transport")
  startDate: Date;           // Start date of the budget period
  endDate: Date;             // End date of the budget period
  description?: string;      // Optional description for the budget
}
