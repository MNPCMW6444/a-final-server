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
  Mutation: {
    editEvent: async (args: any) => {
      const oldEvent = await Event.findById(req.params.id);
      if (!req.body.newItem.title)
        return res.status(400).json({ erroMsg: "title is missing" });
      if (!req.body.newItem.description)
        return res.status(400).json({ erroMsg: "description is missing" });
      if (!req.body.newItem.beginningTime)
        return res.status(400).json({ erroMsg: "Beginning Time is missing" });
      if (!req.body.newItem.endingTime)
        return res.status(400).json({ erroMsg: "Ending Time is missing" });
      if (!req.body.newItem.color)
        return res.status(400).json({ erroMsg: "color is missing" });
      if (!req.body.newItem.location)
        return res.status(400).json({ erroMsg: "location is missing" });
      if (!req.body.newItem.notificationTime)
        return res
          .status(400)
          .json({ erroMsg: "Notification Time is missing" });

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

      const title = req.body.newItem.title;
      const description = req.body.newItem.description;
      const beginningTime = new Date(req.body.newItem.beginningTime);
      const endingTime = new Date(req.body.newItem.endingTime);
      const color = colorMap.get(req.body.newItem.color);
      const location = req.body.newItem.location;
      const notificationTime = new Date(req.body.newItem.notificationTime);
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
      res.json(resAved);
    },
    editTask: async (args: any) => {
      const oldTask = await Task.findById(req.params.id);

      if (!req.body.newItem.title)
        return res.status(400).json({ erroMsg: "title is missing" });
      if (!req.body.newItem.description)
        return res.status(400).json({ erroMsg: "description is missing" });
      if (!req.body.newItem.estimatedTime)
        return res.status(400).json({ erroMsg: "Estimated Time is missing" });
      if (!req.body.newItem.status)
        return res.status(400).json({ erroMsg: "status is missing" });
      if (!req.body.newItem.priority)
        return res.status(400).json({ erroMsg: "priority is missing" });

      const title = req.body.newItem.title;

      const description = req.body.newItem.description;

      const estimatedTime = req.body.newItem.estimatedTime;

      const status = req.body.newItem.status;

      const priority = req.body.newItem.priority;

      const id = (Math.random() * 10000) / 10000 + "";

      if (oldTask) oldTask.title = title;
      if (oldTask) oldTask.description = description;
      if (oldTask) oldTask.estimatedTime = estimatedTime;
      if (oldTask) oldTask.status = status;
      if (oldTask) oldTask.priority = priority;
      if (oldTask) oldTask.id = id;

      const resAved = oldTask && (await oldTask.save());
      res.json(resAved);
    },
    createTask: async (args: any) => {
      if (!req.body.newItem.title)
        return res.status(400).json({ erroMsg: "title is missing" });
      if (!req.body.newItem.description)
        return res.status(400).json({ erroMsg: "description is missing" });
      if (!req.body.newItem.estimatedTime)
        return res.status(400).json({ erroMsg: "Estimated Time is missing" });
      if (!req.body.newItem.status)
        return res.status(400).json({ erroMsg: "status is missing" });
      if (!req.body.newItem.priority)
        return res.status(400).json({ erroMsg: "priority is missing" });

      const title = req.body.newItem.title;

      const description = req.body.newItem.description;

      const estimatedTime = req.body.newItem.estimatedTime;

      const status = req.body.newItem.status;

      const priority = req.body.newItem.priority;

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
      res.json(resAved);
    },
    createEvent: async (args: any) => {
      if (!req.body.newItem.title)
        return res.status(400).json({ erroMsg: "title is missing" });
      if (!req.body.newItem.description)
        return res.status(400).json({ erroMsg: "description is missing" });
      if (!req.body.newItem.beginningTime)
        return res.status(400).json({ erroMsg: "Beginning Time is missing" });
      if (!req.body.newItem.endingTime)
        return res.status(400).json({ erroMsg: "Ending Time is missing" });
      if (!req.body.newItem.color)
        return res.status(400).json({ erroMsg: "color is missing" });
      if (!req.body.newItem.location)
        return res.status(400).json({ erroMsg: "location is missing" });
      if (!req.body.newItem.notificationTime)
        return res
          .status(400)
          .json({ erroMsg: "Notification Time is missing" });

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

      const title = req.body.newItem.title;
      const description = req.body.newItem.description;
      const beginningTime = new Date(req.body.newItem.beginningTime);
      const endingTime = new Date(req.body.newItem.endingTime);
      const color = colorMap.get(req.body.newItem.color);
      const location = req.body.newItem.location;
      const notificationTime = new Date(req.body.newItem.notificationTime);
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
      res.json(resAved);
    },
    deleteTask: async (args: any) => {
      const id = req.params.id;

      await Task.deleteOne({ _id: id });

      res.json({});
    },
    deleteEvent: async (args: any) => {
      const id = req.params.id;

      await Event.deleteOne({ _id: id });

      res.json({});
    },
  },
};
