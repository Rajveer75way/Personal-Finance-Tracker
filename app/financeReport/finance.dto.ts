
export interface IReport {
    userID: number;  // UserID from the User table
    type: 'monthly' | 'yearly';  // Type of report (monthly or yearly)
    generatedAt: Date;  // Date when the report is generated
  }
  