import TaskModel from "./models/taskModel";
import EventModel from "./models/eventModel";
import { PubSub } from "graphql-subscriptions";
import { Event, Task } from "./types/index";

const pubsub = new PubSub();
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

export default {
  Query: {
    allTasks: async () => {
      const tasks = (await TaskModel.find()) as Task[];
      return tasks.map((task: Task) => {
        task._id = task._id.toString();
        return task;
      });
    },
    allEvents: async () => {
      const tasks = (await EventModel.find()) as Event[];
      return tasks.map((event: Event) => {
        event._id = event._id.toString();
        return event;
      });
    },
  },
  Mutation: {
    editEvent: async (_: undefined, { newItem }: { newItem: Event }) => {
      const oldEvent = await EventModel.findById(newItem._id);
      const title = newItem.title;
      const description = newItem.description;
      const beginningTime = new Date(newItem.beginningTime);
      const endingTime = new Date(newItem.endingTime);
      const color = colorMap.get(newItem.color);
      const location = newItem.location;
      const notificationTime = new Date(newItem.notificationTime + "");
      if (oldEvent) {
        oldEvent.title = title;
        oldEvent.description = description;
        oldEvent.beginningTime = beginningTime;
        oldEvent.endingTime = endingTime;
        oldEvent.color = color;
        oldEvent.location = location;
        oldEvent.notificationTime = notificationTime;
      }
      const savedDocument = oldEvent && (await oldEvent.save());
      pubsub.publish("editEvent", { editEvent: savedDocument });
      return savedDocument;
    },
    editTask: async (_: undefined, { newItem }: { newItem: Task }) => {
      const oldTask = await TaskModel.findById(newItem._id);
      const title = newItem.title;
      const description = newItem.description;
      const estimatedTime = newItem.estimatedTime;
      const status = newItem.status;
      const priority = newItem.priority;
      if (oldTask) {
        oldTask.title = title;
        oldTask.description = description;
        oldTask.estimatedTime = estimatedTime;
        oldTask.status = status;
        oldTask.priority = priority;
      }
      const savedDocument = oldTask && (await oldTask.save());
      pubsub.publish("edutTask", { edutTask: savedDocument });
      return savedDocument;
    },
    createTask: async (_: undefined, { newItem }: { newItem: Task }) => {
      const title = newItem.title;
      const description = newItem.description;
      const estimatedTime = newItem.estimatedTime;
      const status = newItem.status;
      const priority = newItem.priority;
      const newTask = new TaskModel({
        title,
        description,
        estimatedTime,
        status,
        priority,
      });
      const savedDocument = await newTask.save();
      pubsub.publish("newTask", { newTask: savedDocument });
      return savedDocument;
    },
    createEvent: async (_: undefined, { newItem }: { newItem: Event }) => {
      const title = newItem.title;
      const description = newItem.description;
      const beginningTime = new Date(newItem.beginningTime);
      const endingTime = new Date(newItem.endingTime);
      const color = colorMap.get(newItem.color);
      const location = newItem.location;
      const notificationTime = new Date(newItem.notificationTime + "");
      const newTask = new EventModel({
        title,
        description,
        beginningTime,
        endingTime,
        color,
        location,
        notificationTime,
      });
      const savedDocument = await newTask.save();
      pubsub.publish("newEvent", { newEvent: savedDocument });
      return savedDocument;
    },
    deleteTask: async (_: undefined, { id }: { id: string }) => {
      const _id = id;
      const deleted = await TaskModel.findById(_id);
      await TaskModel.findByIdAndDelete(_id);
      pubsub.publish("deletedTask", { deletedTask: deleted });
      return deleted;
    },
    deleteEvent: async (_: undefined, { id }: { id: string }) => {
      const _id = id;
      const deleted = await EventModel.findById(_id);
      await EventModel.findByIdAndDelete(_id);
      pubsub.publish("deletedEvent", { deletedEvent: deleted });
      return deleted;
    },
  },
  Subscription: {
    newEvent: { subscribe: () => pubsub.asyncIterator("newEvent") },
    newTask: {
      subscribe() {
        return pubsub.asyncIterator("newTask");
      },
    },
    editEvent: {
      subscribe() {
        return pubsub.asyncIterator("editEvent");
      },
    },
    editTask: {
      subscribe() {
        return pubsub.asyncIterator("editTask");
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
