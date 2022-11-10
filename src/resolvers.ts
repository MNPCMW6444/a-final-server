import TaskModel from "./models/taskModel";
import EventModel from "./models/eventModel";
import { PubSub } from "graphql-subscriptions";
import { Event, Task } from "./types/index";
import { subscribtions, subscribtionTypes } from "./types/enums";

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

EventModel.watch().on("change", async (event) => {
  console.log(event);
  if (event.operationType === "delete")
    pubsub.publish(subscribtions.eventMutation, {
      eventMutation: {
        type: subscribtionTypes.delete,
        id: event.documentKey._id.toString(),
      },
    });
  else if (event.operationType === "update") {
    pubsub.publish(subscribtions.eventMutation, {
      eventMutation: {
        type: subscribtionTypes.edit,
        event: await EventModel.findById(event.documentKey._id.toString()),
      },
    });
  } else
    event.operationType === "insert" &&
      pubsub.publish(subscribtions.eventMutation, {
        eventMutation: {
          type: subscribtionTypes.add,
          event: await EventModel.findById(event.documentKey._id.toString()),
        },
      });
});

TaskModel.watch().on("change", async (event) => {
  if (event.operationType === "delete")
    pubsub.publish(subscribtions.taskMutation, {
      taskMutation: {
        type: subscribtionTypes.delete,
        id: event.documentKey._id.toString(),
      },
    });
  else if (event.operationType === "update") {
    pubsub.publish(subscribtions.taskMutation, {
      taskMutation: {
        type: subscribtionTypes.edit,
        task: await TaskModel.findById(event.documentKey._id.toString()),
      },
    });
  } else
    event.operationType === "insert" &&
      pubsub.publish(subscribtions.taskMutation, {
        taskMutation: {
          type: subscribtionTypes.add,
          task: await TaskModel.findById(event.documentKey._id.toString()),
        },
      });
});

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
      console.log(newItem);
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

      return savedDocument;
    },
    deleteTask: async (_: undefined, { id }: { id: string }) => {
      const toDelete = await TaskModel.findById(id);
      if (toDelete) {
        await TaskModel.findByIdAndDelete(id);

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

        return id;
      } else
        return {
          errorMessage:
            "Can't find the Event to delete. Check The _id - it might be wrong.",
        };
    },
  },
  Subscription: {
    eventMutation: {
      subscribe: () => pubsub.asyncIterator(subscribtions.eventMutation),
    },
    taskMutation: {
      subscribe: () => pubsub.asyncIterator(subscribtions.taskMutation),
    },
  },
};
