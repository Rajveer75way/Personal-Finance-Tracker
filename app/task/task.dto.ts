import mongoose from "mongoose";  // Import mongoose to use ObjectId type

export interface ITask {
  title: string;
  description: string;
  assignedTo: mongoose.Schema.Types.ObjectId;  // Change this to ObjectId
  status: "TODO" | "IN_PROGRESS" | "DONE";
}
