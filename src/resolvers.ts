import Task from "./models/taskModel";
import Event from "./models/eventModel";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

export default {
  Query: {
    allTasks: async () => {
      // { _id: 123123, name: "whatever"}
      const tasks = await Task.find();
      return tasks.map((x: any) => {
        x._id = x._id.toString();
        return x;
      });
    },
    allEvents: async () => {
      // { _id: 123123, name: "whatever"}
      const tasks = await Event.find();
      return tasks.map((x: any) => {
        x._id = x._id.toString();
        return x;
      });
    },
  },
  Mutation: {
    editEvent: async (args: any) => {
      const oldEvent = await Event.findById(args.id);
      if (!args.newItem.title) return null;
      if (!args.newItem.description) return null;
      if (!args.newItem.beginningTime) return null;
      if (!args.newItem.endingTime) return null;
      if (!args.newItem.color) return null;
      if (!args.newItem.location) return null;
      if (!args.newItem.notificationTime) return null;
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
      const title = args.newItem.title;
      const description = args.newItem.description;
      const beginningTime = new Date(args.newItem.beginningTime);
      const endingTime = new Date(args.newItem.endingTime);
      const color = colorMap.get(args.newItem.color);
      const location = args.newItem.location;
      const notificationTime = new Date(args.newItem.notificationTime);
      const id = (Math.random() * 10000) / 10000 + "";
      if (oldEvent) oldEvent.title = title;
      if (oldEvent) oldEvent.description = description;
      if (oldEvent) oldEvent.beginningTime = beginningTime;
      if (oldEvent) oldEvent.endingTime = endingTime;
      if (oldEvent) oldEvent.color = color;
      if (oldEvent) oldEvent.location = location;
      if (oldEvent) oldEvent.notificationTime = notificationTime;
      if (oldEvent) oldEvent.id = id;
      const resAved = oldEvent && (await oldEvent.save());

      pubsub.publish("changes", {
        item: resAved,
      });

      return resAved;
    },
    editTask: async (args: any) => {
      const oldTask = await Task.findById(args.id);
      if (!args.newItem.title) return null;
      if (!args.newItem.description) return null;
      if (!args.newItem.estimatedTime) return null;
      if (!args.newItem.status) return null;
      if (!args.newItem.priority) return null;
      const title = args.newItem.title;
      const description = args.newItem.description;
      const estimatedTime = args.newItem.estimatedTime;
      const status = args.newItem.status;
      const priority = args.newItem.priority;
      const id = (Math.random() * 10000) / 10000 + "";
      if (oldTask) oldTask.title = title;
      if (oldTask) oldTask.description = description;
      if (oldTask) oldTask.estimatedTime = estimatedTime;
      if (oldTask) oldTask.status = status;
      if (oldTask) oldTask.priority = priority;
      if (oldTask) oldTask.id = id;
      const resAved = oldTask && (await oldTask.save());
      return resAved;
    },
    createTask: async (args: any) => {
      if (!args.newItem.title) return null;
      if (!args.newItem.description) return null;
      if (!args.newItem.estimatedTime) return null;
      if (!args.newItem.status) return null;
      if (!args.newItem.priority) return null;
      const title = args.newItem.title;
      const description = args.newItem.description;
      const estimatedTime = args.newItem.estimatedTime;
      const status = args.newItem.status;
      const priority = args.newItem.priority;
      const id = (Math.random() * 10000) / 10000 + "";
      const newTask = new Task({
        title,
        description,
        estimatedTime,
        status,
        priority,
        id,
      });
      const resAved = await newTask.save();
      return resAved;
    },
    createEvent: async (args: any) => {
      if (!args.newItem.title) return null;
      if (!args.newItem.description) return null;
      if (!args.newItem.beginningTime) return null;
      if (!args.newItem.endingTime) return null;
      if (!args.newItem.color) return null;
      if (!args.newItem.location) return null;
      if (!args.newItem.notificationTime) return null;
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
      const title = args.newItem.title;
      const description = args.newItem.description;
      const beginningTime = new Date(args.newItem.beginningTime);
      const endingTime = new Date(args.newItem.endingTime);
      const color = colorMap.get(args.newItem.color);
      const location = args.newItem.location;
      const notificationTime = new Date(args.newItem.notificationTime);
      const id = (Math.random() * 10000) / 10000 + "";
      const newTask = new Event({
        title,
        description,
        beginningTime,
        endingTime,
        color,
        location,
        notificationTime,
        id,
      });
      const resAved = await newTask.save();
      return resAved;
    },
    deleteTask: async (args: any) => {
      const id = args.id;
      await Task.deleteOne({ _id: id });
      return {};
    },
    deleteEvent: async (args: any) => {
      const id = args.id;
      await Event.deleteOne({ _id: id });
      return {};
    },
  },
  Subscription: {
    newEvent: {
      subscribe() {
        return pubsub.asyncIterator("newEvent");
      },
    },
    newTask: {
      subscribe() {
        return pubsub.asyncIterator("newTask");
      },
    },
    deletedEvent: {
      subscribe() {
        return pubsub.asyncIterator("deletedEvent");
      },
    },
    deletedTask: {
      subscribe() {
        return pubsub.asyncIterator("deletedTask");
      },
    },
  },
};
