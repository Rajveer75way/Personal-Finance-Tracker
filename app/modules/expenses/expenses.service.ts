import Expense from "./expenses.schema"; ""
import moment from "moment";  // You can use moment.js to easily handle date manipulation
import {GoogleGenerativeAI} from '@google/generative-ai';
import { text } from "body-parser";
const apiKey = process.env.GEMINI_API_KEY ?? ""; // Fallback to empty string if undefined
const genai = new GoogleGenerativeAI('AIzaSyDnuN7REBRYVgPfJ-MabdtyMl5ARhGFMUg');// Create an expense, ensuring no duplicate for the same category on the same day
export const createExpense = async (data: any) => {
  
  const expense = new Expense(data);
  return expense.save();
};

export const getAllExpenses = async () => {
  return Expense.find().lean();
};

export const getExpenseById = async (id: string) => {
  const expense = await Expense.findById(id).lean();

  if (!expense) {
    throw new Error("Expense not found");
  }

  return expense;
};

export const updateExpense = async (id: string, data: any) => {
  const expense = await Expense.findById(id);

  if (!expense) {
    throw new Error("Expense not found");
  }
  return Expense.findByIdAndUpdate(id, data, { new: true });
};

export const deleteExpense = async (id: string) => {
  const expense = await Expense.findByIdAndDelete(id);
  if (!expense) {
    throw new Error("Expense not found");
  }
  return expense;
};

export const getExpensesByCategory = async (startDate: string, endDate: string) => {
  // Convert startDate and endDate to valid Date objects
  const start = moment(startDate).startOf('day').toDate();
  const end = moment(endDate).endOf('day').toDate();
    console.log(start, end);
  const expenses = await Expense.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: "$category",  // Group by category
        totalAmount: { $sum: "$amount" },  // Sum the amounts for each category
        count: { $sum: 1 }  // Count the number of expenses in each category
      }
    },
    {
      $sort: { totalAmount: -1 }  // Sort by total amount spent (descending)
    }
  ]);

  return expenses;
};

export const getExpensesByCategoryAndDateRange = async (category: string, startDate: Date, endDate: Date) => {
    return Expense.find({
      category: category,
      date: { $gte: startDate, $lte: endDate },
    }).lean();
  };
  // In expense.service.ts
  const generateSuggestionsWithAI = async (trends: { month: number; totalAmount: number }[]) => {
    // Prepare the trend data in a readable format for the AI model
    const trendDescriptions = trends.map((trend) => {
      return `Month: ${trend.month}, Amount spent: ${trend.totalAmount}`;
    }).join(", ");
    // Construct the prompt for Google Generative AI
    const prompt = `
    You are a financial assistant. Given the following spending trends, provide clear and concise spending suggestions:
    ${trendDescriptions}
    `;
    try {
      // Using GenerativeModel to call the AI for suggestions
      const model =  genai.getGenerativeModel({model:"gemini-1.5-flash-8b"});
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
  export const getSpendingTrendsWithAI = async (category: string, startDate: Date, endDate: Date) => {
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