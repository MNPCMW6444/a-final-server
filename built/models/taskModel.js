"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var taskSchema = new mongoose_1["default"].Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    estimatedTime: {
        type: String,
        required: true
    },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    untilDate: {
        type: Date,
        required: false
    },
    review: { type: String, required: false },
    timeSpent: {
        type: String,
        required: false
    },
    location: { type: String, required: false },
    notificationTime: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});
exports["default"] = mongoose_1["default"].model("task", taskSchema);
