"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("task", taskSchema);