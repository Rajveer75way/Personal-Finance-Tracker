import Budget from "./budget.schema";

/**
 * Creates a new budget and saves it to the database.
 * @param {any} data - The budget data to be saved.
 * @returns {Promise<Budget>} The created budget document.
 */
export const createBudget = async (data: any) => {
  const budget = new Budget(data);
  return budget.save();
};
/**
 * Retrieves all budgets from the database.
 * @returns {Promise<Budget[]>} An array of all budgets.
 */
export const getAllBudgets = async () => {
  return Budget.find().lean();
};
/**
 * Retrieves a budget by its id from the database.
 * @param {string} id - The id of the budget to be retrieved.
 * @returns {Promise<Budget | null>} The budget document or null if not found.
 */
export const getBudgetById = async (id: string) => {
  return Budget.findById(id).lean();
};

/**
 * Updates a budget by its id and saves the changes to the database.
 * @param {string} id - The id of the budget to be updated.
 * @param {any} data - The updated budget data.
 * @returns {Promise<Budget | null>} The updated budget document or null if not found.
 */
export const updateBudget = async (id: string, data: any) => {
  return Budget.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Deletes a budget by its id from the database.
 * @param {string} id - The id of the budget to be deleted.
 * @returns {Promise<Budget | null>} The deleted budget document or null if not found.
 */
export const deleteBudget = async (id: string) => {
  return Budget.findByIdAndDelete(id);
};

/**
 * Retrieves all budgets for a particular category and date range from the database.
 * @param {string} category - The category of the budgets to be retrieved.
 * @param {Date} startDate - The start date of the budgets to be retrieved.
 * @param {Date} endDate - The end date of the budgets to be retrieved.
 * @returns {Promise<Budget[]>} An array of all budgets matching the criteria.
 */
export const getBudgetsByCategoryAndDateRange = async (
  category: string,
  startDate: Date,
  endDate: Date
) => {
  return Budget.find({
    category: category,
    startDate: { $gte: startDate },
    endDate: { $lte: endDate },
  }).lean();
};
