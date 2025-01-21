import Expense from "./expenses.schema";
import moment from "moment"; // You can use moment.js to easily handle date manipulation
import { GoogleGenerativeAI } from "@google/generative-ai";
import Budget from "../budget/budget.schema";
// Create an expense, ensuring no duplicate for the same category on the same day
/**
 * Create a new expense and save it to the database.
 * @param {any} data - The expense data to be saved.
 * @returns {Promise<Expense>} The created expense document.
 */
export const createExpense = async (data: any) => {
  const { category, amount } = data;

  const budget = await Budget.findOne({ category });

  if (!budget) {
    throw new Error(`No budget exists for the category "${category}".`);
  }

  // Check if the expense amount exceeds the remaining budget
  if (amount > budget.amount) {
    throw new Error(
      `Expense amount $${amount.toFixed(2)} exceeds the available budget of $${budget.amount.toFixed(2)} for the category "${category}".`
    );
  }

  // Deduct the expense amount from the remaining budget
  budget.amount -= amount;
  await budget.save();

  // Create and save the expense
  const expense = new Expense(data);
  return expense.save();
};

/**
 * Retrieve all expenses from the database.
 * @returns {Promise<Expense[]>} A list of all expenses.
 */
export const getAllExpenses = async () => {
  return Expense.find().lean();
};

/**
 * Get a specific expense by its ID.
 * @param {string} id - The ID of the expense to be retrieved.
 * @returns {Promise<Expense>} The retrieved expense.
 * @throws {Error} Throws an error if the expense is not found.
 */
export const getExpenseById = async (id: string) => {
  const expense = await Expense.findById(id).lean();
  if (!expense) {
    throw new Error("Expense not found");
  }
  return expense;
};
/**
 * Update an existing expense by its ID.
 * @param {string} id - The ID of the expense to be updated.
 * @param {any} data - The data to update the expense with.
 * @returns {Promise<Expense>} The updated expense document.
 * @throws {Error} Throws an error if the expense is not found.
 */
export const updateExpense = async (id: string, data: any) => {
  const expense = await Expense.findById(id);
  if (!expense) {
    throw new Error("Expense not found");
  }
  return Expense.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Delete an expense by its ID.
 * @param {string} id - The ID of the expense to be deleted.
 * @returns {Promise<Expense>} The deleted expense document.
 * @throws {Error} Throws an error if the expense is not found.
 */
export const deleteExpense = async (id: string) => {
  const expense = await Expense.findByIdAndDelete(id);
  if (!expense) {
    throw new Error("Expense not found");
  }
  return expense;
};

/**
 * Get expenses aggregated by category within a specified date range.
 * @param {string} startDate - The start date of the date range.
 * @param {string} endDate - The end date of the date range.
 * @returns {Promise<any[]>} A list of aggregated expenses by category within the specified date range.
 */
export const getExpensesByCategory = async (
  startDate: string,
  endDate: string
) => {
  // Convert startDate and endDate to valid Date objects
  const start = moment(startDate).startOf("day").toDate();
  const end = moment(endDate).endOf("day").toDate();
  console.log(start, end);
  const expenses = await Expense.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: "$category", // Group by category
        totalAmount: { $sum: "$amount" }, // Sum the amounts for each category
        count: { $sum: 1 }, // Count the number of expenses in each category
      },
    },
    {
      $sort: { totalAmount: -1 }, // Sort by total amount spent (descending)
    },
  ]);

  return expenses;
};

/**
 * Get expenses by a specific category within a given date range.
 * @param {string} category - The category of expenses to be retrieved.
 * @param {Date} startDate - The start date of the date range.
 * @param {Date} endDate - The end date of the date range.
 * @returns {Promise<Expense[]>} A list of expenses within the category and date range.
 */
export const getExpensesByCategoryAndDateRange = async (
  category: string,
  startDate: Date,
  endDate: Date
) => {
  return Expense.find({
    category: category,
    date: { $gte: startDate, $lte: endDate },
  }).lean();
};
// In expense.service.ts
/**
 * Generate spending suggestions using AI based on spending trends.
 * @param {Object[]} trends - An array of spending trends, each with a month and totalAmount.
 * @param {number} trends.month - The month of the trend.
 * @param {number} trends.totalAmount - The total amount spent in that month.
 * @returns {Promise<string>} The AI-generated spending suggestions.
 * @throws {Error} Throws an error if AI suggestion generation fails.
 */
const generateSuggestionsWithAI = async (
  trends: { month: number; totalAmount: number }[]
) => {
  // Prepare the trend data in a readable format for the AI model
  const trendDescriptions = trends
    .map((trend) => {
      return `Month: ${trend.month}, Amount spent: ${trend.totalAmount}`;
    })
    .join(", ");
  // Construct the prompt for Google Generative AI
  const prompt = `
    You are a financial assistant. Given the following spending trends, provide clear and concise spending suggestions:
    ${trendDescriptions}
    `;
  try {
    const apiKey = process.env.GEMINI_API_KEY ?? ""; // Fallback to empty string if undefined
console.log(apiKey);
const genai = new GoogleGenerativeAI(apiKey); 
    // Using GenerativeModel to call the AI for suggestions
    const model = genai.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    // Call the model's generateContent method to get AI suggestions
    const response = await model.generateContent(prompt);
    // Extracting the AI-generated text
    const text = response.response.text();
    return text;
  } catch (error) {
    console.error("Error generating suggestions from AI:", error);
    return "Unable to generate suggestions at the moment.";
  }
};

// Service Function: Get spending trends and generate AI-based suggestions
/**
 * Get spending trends for a particular category within a date range and generate AI-based suggestions.
 * @param {string} category - The category for which spending trends are to be retrieved.
 * @param {Date} startDate - The start date of the date range.
 * @param {Date} endDate - The end date of the date range.
 * @returns {Promise<{ trends: { month: number; totalAmount: number }[], suggestions: string }>}
 * A response containing the spending trends and AI-generated suggestions.
 */
export const getSpendingTrendsWithAI = async (
  category: string,
  startDate: Date,
  endDate: Date
) => {
  const expenses = await Expense.aggregate([
    {
      $match: {
        category: category,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $month: "$date" },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        month: { $add: ["$_id", 1] },
        totalAmount: 1,
        _id: 0,
      },
    },
  ]);

  const validTrends = expenses.map((trend) => {
    const adjustedMonth = trend.month > 12 ? trend.month % 12 : trend.month;
    return {
      month: adjustedMonth,
      totalAmount: trend.totalAmount,
    };
  });
  // Generate suggestions using Google Generative AI
  const aiSuggestions = await generateSuggestionsWithAI(validTrends);
  return {
    trends: validTrends,
    suggestions: aiSuggestions,
  };
};
