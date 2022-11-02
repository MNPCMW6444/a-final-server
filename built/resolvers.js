"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskModel_1 = __importDefault(require("./models/taskModel"));
const eventModel_1 = __importDefault(require("./models/eventModel"));
exports.default = {
    Query: {
        allTasks: async () => {
            // { _id: 123123, name: "whatever"}
            const tasks = await taskModel_1.default.find();
            return tasks.map((x) => {
                x._id = x._id.toString();
                return x;
            });
        },
        allEvents: async () => {
            // { _id: 123123, name: "whatever"}
            const tasks = await eventModel_1.default.find();
            return tasks.map((x) => {
                x._id = x._id.toString();
                return x;
            });
        },
    },
    MutationTasks: {
        createTask: async (args) => {
            // { _id: 123123, name: "whatever"}
            const newTask = await new taskModel_1.default(args).save();
            //newTask._id = newTask._id.toString();
            return newTask;
        },
    },
};
