import Task from "./models/taskModel";
import Event from "./models/eventModel";

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
  MutationTasks: {
    createTask: async (args: any) => {
      // { _id: 123123, name: "whatever"}
      const newTask = await new Task(args).save();
      //newTask._id = newTask._id.toString();
      return newTask;
    },
  },
};
