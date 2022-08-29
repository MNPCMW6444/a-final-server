"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const eventSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("event", eventSchema);
