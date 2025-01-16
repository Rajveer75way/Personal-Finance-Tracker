
# Personal Finance Tracker

## Overview

Personal Finance Tracker is a web application designed to help users track their expenses, manage budgets, and generate financial reports. The application allows users to input their spending, set monthly or yearly budgets, and analyze trends in their financial data. The generated financial reports provide valuable insights into their financial behavior, making it easier to track spending, stay within budget, and improve financial planning.

## Features

- **Expense Tracking**: Users can record and categorize their expenses.
- **Budget Creation**: Users can set a budget for specific categories and periods.
- **Financial Reports**: Generate PDF reports that summarize spending, budget, and provide financial suggestions.
- **Spending Trend Analysis**: Visual representation of spending trends to identify patterns over time.
- **Category-wise Spending**: Detailed overview of spending by category (e.g., Food, Travel, Entertainment).

## Tech Stack

- **Backend**: Node.js, Express.js, Typescript
- **Database**: MongoDB
- **Authentication**: JWT (if required in the future for authentication)
- **PDF Generation**: PDFKit
- **API Documentation**: Swagger

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (or a cloud MongoDB service like Atlas)

### Steps to Install

1. Clone the repository:

   ```bash
   git clone https://github.com/Rajveer75way/Personal-Finance-Tracker.git
   ```



2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up your MongoDB database (either locally or via MongoDB Atlas).

4. Create a `.env.local` file in the root directory and add the following environment variables:

   ```bash
   MONGO_URI=<your_mongo_db_connection_string>
   PORT=5000
   GEMINI_API_KEY=''
   ```

6. Run the application:

   ```bash
   npm run local
   ```

7. The server will start at `http://localhost:5000`.

## API Documentation

The project includes API endpoints to perform CRUD operations for expenses, budgets, and generate reports. The API documentation is available via [Swagger UI](http://localhost:5000/docs) once the server is running.

### Endpoints

#### 1. Expense Routes

- **GET** `/api/expenses`  
  - Get a list of all expenses.

- **POST** `/api/expenses`  
  - Add a new expense.

- **GET** `/api/expenses/:id`  
  - Get a specific expense by its ID.

- **PUT** `/api/expenses/:id`  
  - Update an existing expense.

- **DELETE** `/api/expenses/:id`  
  - Delete an expense.

- **POST** `/api/expenses/all-category-date`  
  - Get expenses for all categories within a specific date range.

- **POST** `/api/expenses/particular-category-date`  
  - Get expenses for a particular category within a specific date range.

- **POST** `/api/expenses/spending-trends`  
  - Get spending trends based on the data.

### 2. Budget Routes

- **GET** `/api/budget`  
  - Get a list of all budgets.

- **POST** `/api/budget`  
  - Set a new budget.

- **GET** `/api/budget/:id`  
  - Get a specific budget by its ID.

- **PUT** `/api/budget/:id`  
  - Update an existing budget.

- **DELETE** `/api/budget/:id`  
  - Delete a budget.

- **POST** `/api/budget/particular-category-date`  
  - Get budgets for a specific category within a date range.

#### 3. Report Routes

- **POST** `/api/financial/generate-financial-report` - Generate a PDF financial report based on the selected start date, end date, and category.

## Generating Financial Reports

You can generate a financial report by providing the start date, end date, and category in the request body. The report will be generated and immediately downloaded as a PDF file.

### Request Body Example

```json
{
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "category": "Food"
}
```

### Response

The response will prompt the download of a PDF financial report containing:

- **Total Expenses**: The total amount spent during the given period.
- **Budget Overview**: Comparison between actual expenses and the set budget for the category.
- **Suggestions**: Insights such as whether the user stayed within the budget or exceeded it.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework for handling HTTP requests.
- **MongoDB**: NoSQL database used for storing data.
- **PDFKit**: Library for generating PDFs.
- **Swagger UI**: API documentation and testing.
- **TypeScript**: Superset of JavaScript for type safety and better code organization.
