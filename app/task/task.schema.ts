import mongoose from "mongoose";
import { type ITask } from "./task.dto";
import { IUser } from "../user/user.dto";  // Assuming IUser is the User interface

const Schema = mongoose.Schema;

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,  // Use ObjectId for referencing the user
    ref: "user",  // The name of the User model in the database
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["TODO", "IN_PROGRESS", "DONE"],
    default: "TODO"
  }
}, { timestamps: true });

export default mongoose.model<ITask>("task", TaskSchema);
