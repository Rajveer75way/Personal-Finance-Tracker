import Budget from "./budget.schema";

export const createBudget = async (data: any) => {
  const budget = new Budget(data);
  return budget.save();
};

export const getAllBudgets = async () => {
  return Budget.find().lean();
};

export const getBudgetById = async (id: string) => {
  return Budget.findById(id).lean();
};

export const updateBudget = async (id: string, data: any) => {
  return Budget.findByIdAndUpdate(id, data, { new: true });
};

export const deleteBudget = async (id: string) => {
  return Budget.findByIdAndDelete(id);
};

export const getBudgetsByCategoryAndDateRange = async (category: string, startDate: Date, endDate: Date) => {
  return Budget.find({
    category: category,
    startDate: { $gte: startDate },
    endDate: { $lte: endDate },
  }).lean();
};
