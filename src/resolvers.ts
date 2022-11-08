import TaskModel from "./models/taskModel";
import EventModel from "./models/eventModel";
import { PubSub } from "graphql-subscriptions";
import { Event, Task } from "./types/index";
import { subscribtions } from "./types/enums";

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
      if (oldEvent) {
        oldEvent.title = newItem.title;
        oldEvent.description = newItem.description;
        oldEvent.beginningTime = new Date(newItem.beginningTime);
        oldEvent.endingTime = new Date(newItem.endingTime);
        oldEvent.color = colorMap.get(newItem.color);
        oldEvent.location = newItem.location;
        oldEvent.notificationTime = new Date(newItem.notificationTime + "");
      } else
        return {
          errorMessage:
            "Can't find the Event to edit. Check The _id - it might be wrong.",
        };
      const savedDocument = oldEvent && (await oldEvent.save());
      //pubsub.publish("editEvent", { editEvent: savedDocument });
      return savedDocument;
    },
    editTask: async (_: undefined, { newItem }: { newItem: Task }) => {
      const oldTask = await TaskModel.findById(newItem._id);
      if (oldTask) {
        oldTask.title = newItem.title;
        oldTask.description = newItem.description;
        oldTask.estimatedTime = newItem.estimatedTime;
        oldTask.status = newItem.status;
        oldTask.priority = newItem.priority;
      } else
        return {
          errorMessage:
            "Can't find the Task to edit. Check The _id - it might be wrong.",
        };
      const savedDocument = oldTask && (await oldTask.save());
      //pubsub.publish("edutTask", { edutTask: savedDocument });
      return savedDocument;
    },
    createTask: async (_: undefined, { newItem }: { newItem: Task }) => {
      const newTask = new TaskModel({
        title: newItem.title,
        description: newItem.description,
        estimatedTime: newItem.estimatedTime,
        status: newItem.status,
        priority: newItem.priority,
      });
      const savedDocument = await newTask.save();
      //pubsub.publish("newTask", { newTask: savedDocument });
      return savedDocument;
    },
    createEvent: async (_: undefined, { newItem }: { newItem: Event }) => {
      const newTask = new EventModel({
        title: newItem.title,
        description: newItem.description,
        beginningTime: new Date(newItem.beginningTime),
        endingTime: new Date(newItem.endingTime),
        color: colorMap.get(newItem.color),
        location: newItem.location,
        notificationTime: new Date(newItem.notificationTime + ""),
      });
      const savedDocument = await newTask.save();
      //pubsub.publish("newEvent", { newEvent: savedDocument });
      return savedDocument;
    },
    deleteTask: async (_: undefined, { id }: { id: string }) => {
      const toDelete = await TaskModel.findById(id);
      if (toDelete) {
        await TaskModel.findByIdAndDelete(id);
        //pubsub.publish("deletedTask", id);
        return id;
      } else
        return {
          errorMessage:
            "Can't find the Task to delete. Check The _id - it might be wrong.",
        };
    },
    deleteEvent: async (_: undefined, { id }: { id: string }) => {
      const toDelete = await EventModel.findById(id);
      if (toDelete) {
        await EventModel.findByIdAndDelete(id);
        //pubsub.publish("deletedEvent", id);
        return id;
      } else
        return {
          errorMessage:
            "Can't find the Event to delete. Check The _id - it might be wrong.",
        };
    },
  },
  Subscription: {
    newEvent: {
      subscribe: () => pubsub.asyncIterator(subscribtions.newEvent),
    },
    newTask: { subscribe: () => pubsub.asyncIterator(subscribtions.newTask) },
    editEvent: {
      subscribe: () => pubsub.asyncIterator(subscribtions.editEvent),
    },
    editTask: {
      subscribe: () => pubsub.asyncIterator(subscribtions.editTask),
    },
    deletedEvent: {
      subscribe: () => pubsub.asyncIterator(subscribtions.deletedEvent),
    },
    deletedTask: {
      subscribe: () => pubsub.asyncIterator(subscribtions.deletedTask),
    },
  },
};
