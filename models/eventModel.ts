import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
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
    beginningTime: {
      type: Date,
      required: true,
    },
    endingTime: {
      type: Date,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    invitedGuests: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    notificationTime: {
      type: Date,
      required: false,
    },
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

export default mongoose.model("event", eventSchema);
