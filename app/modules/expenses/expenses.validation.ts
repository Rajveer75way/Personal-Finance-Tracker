
import { body } from "express-validator";

export const validateExpense = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),
  body("category").notEmpty().withMessage("Category is required"),
  body("date").notEmpty().withMessage("Date is required").isISO8601().withMessage("Invalid date format"),
];
