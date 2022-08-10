import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    estimatedTime: {
      type: Date,
      required: true,
    },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    untilDate: {
      type: Date,
      required: false,
    },
    review: { type: String, required: false },
    timeSpent: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("task", taskSchema);
