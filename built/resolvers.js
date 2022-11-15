"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskModel_1 = __importDefault(require("./models/taskModel"));
const eventModel_1 = __importDefault(require("./models/eventModel"));
const graphql_subscriptions_1 = require("graphql-subscriptions");
const enums_1 = require("./types/enums");
const pubsub = new graphql_subscriptions_1.PubSub();
const colorMap = new Map();
colorMap.set("🔴", "Red");
colorMap.set("🟠", "Orange");
colorMap.set("🟡", "Yellow");
colorMap.set("🟢", "Green");
colorMap.set("🔵", "Blue");
colorMap.set("🟣", "Purple");
colorMap.set("⚫️", "Black");
colorMap.set("⚪️", "White");
colorMap.set("🟤", "Brown");
eventModel_1.default.watch().on("change", async (event) => {
    if (event.operationType === "delete")
        pubsub.publish(enums_1.subscribtions.eventMutation, {
            eventMutation: {
                type: enums_1.subscribtionTypes.delete,
                id: event.documentKey._id.toString(),
            },
        });
    else if (event.operationType === "update") {
        pubsub.publish(enums_1.subscribtions.eventMutation, {
            eventMutation: {
                type: enums_1.subscribtionTypes.edit,
                event: await eventModel_1.default.findById(event.documentKey._id.toString()),
            },
        });
    }
    else
        event.operationType === "insert" &&
            pubsub.publish(enums_1.subscribtions.eventMutation, {
                eventMutation: {
                    type: enums_1.subscribtionTypes.add,
                    event: await eventModel_1.default.findById(event.documentKey._id.toString()),
                },
            });
});
taskModel_1.default.watch().on("change", async (event) => {
    if (event.operationType === "delete")
        pubsub.publish(enums_1.subscribtions.taskMutation, {
            taskMutation: {
                type: enums_1.subscribtionTypes.delete,
                id: event.documentKey._id.toString(),
            },
        });
    else if (event.operationType === "update") {
        pubsub.publish(enums_1.subscribtions.taskMutation, {
            taskMutation: {
                type: enums_1.subscribtionTypes.edit,
                task: await taskModel_1.default.findById(event.documentKey._id.toString()),
            },
        });
    }
    else
        event.operationType === "insert" &&
            pubsub.publish(enums_1.subscribtions.taskMutation, {
                taskMutation: {
                    type: enums_1.subscribtionTypes.add,
                    task: await taskModel_1.default.findById(event.documentKey._id.toString()),
                },
            });
});
exports.default = {
    Query: {
        allTasks: async () => {
            const tasks = (await taskModel_1.default.find());
            return tasks.map((task) => {
                task._id = task._id.toString();
                return task;
            });
        },
        allEvents: async () => {
            const tasks = (await eventModel_1.default.find());
            return tasks.map((event) => {
                event._id = event._id.toString();
                return event;
            });
        },
    },
    Mutation: {
        editEvent: async (_, { newItem }) => {
            const oldEvent = await eventModel_1.default.findById(newItem._id);
            if (oldEvent) {
                oldEvent.title = newItem.title;
                oldEvent.description = newItem.description;
                oldEvent.beginningTime = new Date(newItem.beginningTime);
                oldEvent.endingTime = new Date(newItem.endingTime);
                oldEvent.color = colorMap.get(newItem.color);
                oldEvent.location = newItem.location;
                oldEvent.notificationTime = new Date(newItem.notificationTime + "");
            }
            else {
                return {
                    errorMessage: "Can't find the Event to edit. Check The _id - it might be wrong.",
                };
            }
            const savedDocument = oldEvent && (await oldEvent.save());
            return savedDocument;
        },
        editTask: async (_, { newItem }) => {
            const oldTask = await taskModel_1.default.findById(newItem._id);
            const { title, description, estimatedTime, status, priority } = newItem;
            if (oldTask) {
                oldTask.title = title;
                oldTask.description = description;
                oldTask.estimatedTime = estimatedTime;
                oldTask.status = status;
                oldTask.priority = priority;
            }
            else
                return {
                    errorMessage: "Can't find the Task to edit. Check The _id - it might be wrong.",
                };
            const savedDocument = oldTask && (await oldTask.save());
            return savedDocument;
        },
        createTask: async (_, { newItem }) => {
            const newTask = new taskModel_1.default({
                title: newItem.title,
                description: newItem.description,
                estimatedTime: newItem.estimatedTime,
                status: newItem.status,
                priority: newItem.priority,
            });
            const savedDocument = await newTask.save();
            return savedDocument;
        },
        createEvent: async (_, { newItem }) => {
            const newTask = new eventModel_1.default({
                title: newItem.title,
                description: newItem.description,
                beginningTime: new Date(newItem.beginningTime),
                endingTime: new Date(newItem.endingTime),
                color: colorMap.get(newItem.color),
                location: newItem.location,
                notificationTime: new Date(newItem.notificationTime + ""),
            });
            const savedDocument = await newTask.save();
            return savedDocument;
        },
        deleteTask: async (_, { id }) => {
            const toDelete = await taskModel_1.default.findById(id);
            if (toDelete) {
                await taskModel_1.default.findByIdAndDelete(id);
                return id;
            }
            else
                return {
                    errorMessage: "Can't find the Task to delete. Check The _id - it might be wrong.",
                };
        },
        deleteEvent: async (_, { id }) => {
            console.log(id);
            const toDelete = await eventModel_1.default.findById(id);
            if (toDelete) {
                await eventModel_1.default.findByIdAndDelete(id);
                return id;
            }
            else
                return {
                    errorMessage: "Can't find the Event to delete. Check The _id - it might be wrong.",
                };
        },
    },
    Subscription: {
        eventMutation: {
            subscribe: () => pubsub.asyncIterator(enums_1.subscribtions.eventMutation),
        },
        taskMutation: {
            subscribe: () => pubsub.asyncIterator(enums_1.subscribtions.taskMutation),
        },
    },
};
