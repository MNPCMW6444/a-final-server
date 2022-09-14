import express from "express";
import cors from "cors";
import mock from "./assets/mock.json";
import Task from "./models/taskModel";
import Event from "./models/eventModel";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());

app.listen(port, () => console.log(`Server started on port: ${port}`));

app.use(
  cors({
    origin: ["http://localhost:3000", "https://finalproject.flexboxtorchy.com"],
    credentials: true,
  })
);

dotenv.config();

mongoose.connect(
  "" + process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions,
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to Main MongoDB");
  }
);

app.get("/alldata", async (_, res) => {
  res.json(mock);
  //res.json({ tasks: await Task.find() });
});

app.get("/tasks-all", async (_, res) => {
  // res.json({ tasks: mock.tasks, events: [] });
  res.json({ tasks: await Task.find() });
});

app.get("/events-all", async (_, res) => {
  // res.json({ events: mock.events, tasks: [] });
  res.json({ events: await Event.find() });
});

app.get("/all-today", async (_, res) => {
  /* res.json({
    events: mock.events.filter(
      (event) =>
        new Date(event["beginning Time"]).getDay() === new Date().getDay()
    ),
    tasks: mock.tasks.filter(
      (task) => task.untilDate === new Date().toDatestring()
    ),
  }); */
  const now = new Date();
  const todayBeginnig = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  res.json({
    tasks: await Task.find({ estimatedTime: { $gte: todayBeginnig } }),
    events: await Event.find({ beginningTime: { $gte: todayBeginnig } }),
  });
});

app.post(
  "/saveTask",
  async (
    req: {
      body: {
        dataToSave: {
          title: string;
          description: string;
          estimatedTime: Date;
          status: string;
          priority: string;
          timeSpent: number;
          location: string;
          notificationTime: Date;
        };
      };
    },
    res
  ) => {
    /*mock.tasks.push({...req.body.dataToSave, id:Math.random()});
   res.json({
    events: mock.events.filter(
      (event) =>
        new Date(event["beginning Time"]).getDay() === new Date().getDay()
    ),
    tasks: mock.tasks.filter(
      (task) => task.untilDate === new Date().toDatestring()
    ),
  }); */
    const newTask = new Task({ ...req.body.dataToSave });
    await newTask.save();
    res.json(await Task.find());
  }
);

app.post(
  "/saveEvent",
  async (
    req: {
      body: {
        dataToSave: {
          title: string;
          description: string;
          estimatedTime: Date;
          priority: string;
          beginningTime: Date;
          endingTime: Date;
          color?: string;
          invitedGuests?: string;
          location?: string;
        };
      };
    },
    res
  ) => {
    /*mock.events.push({...req.body.dataToSave, id:Math.random()});
   res.json({
    events: mock.events.filter(
      (event) =>
        new Date(event["beginning Time"]).getDay() === new Date().getDay()
    ),
    events: mock.events.filter(
      (event) => event.untilDate === new Date().toDatestring()
    ),
  }); */
    const newEvent = new Event({ ...req.body.dataToSave });
    await newEvent.save();
    res.json(await Event.find());
  }
);

app.put(
  "/saveTask",
  async (
    req: {
      body: {
        id: string;
        dataToSave: {
          title: string;
          description: string;
          estimatedTime: Date;
          status: string;
          priority: string;
          timeSpent: number;
          location: string;
          notificationTime: Date;
        };
      };
    },
    res
  ) => {
    /*mock.tasks.push({...req.body.dataToSave, id:Math.random()});
   res.json({
    events: mock.events.filter(
      (event) =>
        new Date(event["beginning Time"]).getDay() === new Date().getDay()
    ),
    tasks: mock.tasks.filter(
      (task) => task.untilDate === new Date().toDatestring()
    ),
  }); */
    const editedTask = await Task.findById(req.body.id);
    if (editedTask === null) res.status(400);
    else {
      editedTask.title = req.body.dataToSave.title;
      editedTask.description = req.body.dataToSave.description;
      editedTask.estimatedTime = req.body.dataToSave.estimatedTime;
      editedTask.status = req.body.dataToSave.status;
      editedTask.priority = req.body.dataToSave.priority;
      editedTask.timeSpent = req.body.dataToSave.timeSpent;
      editedTask.location = req.body.dataToSave.location;
      editedTask.notificationTime = req.body.dataToSave.notificationTime;
      await editedTask.save();
    }
    res.json(editedTask);
  }
);

app.put(
  "/saveEvent",
  async (
    req: {
      body: {
        id: string;
        dataToSave: {
          title: string;
          description: string;
          estimatedTime: Date;
          priority: string;
          beginningTime: Date;
          endingTime: Date;
          color?: string;
          invitedGuests?: string;
          location?: string;
          notificationTime?: Date;
        };
      };
    },
    res
  ) => {
    const editedEvent = await Event.findById(req.body.id);
    if (editedEvent === null) res.status(400);
    else {
      editedEvent.title = req.body.dataToSave.title;
      editedEvent.description = req.body.dataToSave.description;
      editedEvent.beginningTime = req.body.dataToSave.beginningTime;
      editedEvent.endingTime = req.body.dataToSave.endingTime;
      if (req.body.dataToSave.color)
        editedEvent.color = req.body.dataToSave.color;
      editedEvent.location = req.body.dataToSave.location;
      editedEvent.notificationTime = req.body.dataToSave.notificationTime;
      editedEvent.invitedGuests = req.body.dataToSave.invitedGuests;
      await editedEvent.save();
    }
    res.json(editedEvent);
  }
);

app.delete("/events/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) await event.delete();
  res.json(await Event.find());
});

app.delete("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) await task.delete();
  res.json(await Task.find());
});
