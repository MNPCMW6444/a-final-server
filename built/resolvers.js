"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    Query: {
        allTasks: async (parent, args, { Task }) => {
            // { _id: 123123, name: "whatever"}
            const tasks = await Task.find();
            return tasks.map((x) => {
                x._id = x._id.toString();
                return x;
            });
        },
    },
    MutationTasks: {
        createTask: async (parent, args, { Task }) => {
            // { _id: 123123, name: "whatever"}
            const newTask = await new Task(args).save();
            newTask._id = newTask._id.toString();
            return newTask;
        },
    },
};
