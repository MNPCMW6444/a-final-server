import taskModel from "./models/taskModel";

export default {
  Query: {
    alltasks: async (parent: any, args: any, { Task }: { Task: any }) => {
      // { _id: 123123, name: "whatever"}
      const tasks = await Task.find();
      return tasks.map((x: typeof Task) => {
        x._id = x._id.toString();
        return x;
      });
    },
  },
  Mutation: {
    createCat: async (parent: any, args: any, { Task }: { Task: any }) => {
      // { _id: 123123, name: "whatever"}
      const newTask = await new Task(args).save();
      newTask._id = newTask._id.toString();
      return newTask;
    },
  },
};
