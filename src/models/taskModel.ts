import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    estimatedTime: {
      type: String,
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
      type: String,
      required: false,
    },
    location: { type: String, required: false },
    notificationTime: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("task", taskSchema);
