// report.schema.ts

import mongoose from 'mongoose';
import { IReport } from './finance.dto';  // Importing the DTO

const ReportSchema = new mongoose.Schema<IReport>(
  {
    userID: { type: Number, required: true },  // Reference to the UserID
    type: { type: String, enum: ['monthly', 'yearly'], required: true },  // Report type
    generatedAt: { type: Date, required: true },  // Date when the report is generated
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt
);

export default mongoose.model<IReport>('Report', ReportSchema);  // Export the model
