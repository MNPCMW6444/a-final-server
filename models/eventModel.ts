import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    id: {
      type: String,
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
      type: [String],
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    notificationTime: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("event", eventSchema);
