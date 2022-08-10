import express from "express";
import cors from "cors";
import mock from "./mock.json";
import Task from "./models/taskModel";
import Event from "./models/eventModel";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());

app.listen(
  port,
  () => /* console.log(`Server started on port: ${port}`) */ null
);

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

app.get("/tasks-all", async (_, res) => {
  // res.json({ tasks: mock.tasks, events: [] });
  res.json(await Task.find());
});

app.get("/events-all", async (_, res) => {
  // res.json({ events: mock.events, tasks: [] });
  res.json(await Event.find());
});

app.get("/all-today", (_, res) => {
  res.json({
    events: mock.events.filter(
      (event) =>
        new Date(event["beginning Time"]).getDay() === new Date().getDay()
    ),
    tasks: mock.tasks.filter(
      (task) => task.untilDate === new Date().toDateString()
    ),
  });
});

app.post(
  "/saveTask",
  async (
    req: {
      body: {
        dataToSave: {
          title: String;
          description: String;
          estimatedTime: Date;
          status: String;
          priority: String;
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
      (task) => task.untilDate === new Date().toDateString()
    ),
  }); */
    const newTask = new Task({ ...req.body.dataToSave, id: Math.random() });
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
          title: String;
          description: String;
          estimatedTime: Date;
          priority: String;
          beginningTime: Date;
          endingTime: Date;
          color?: String;
          invitedGuests?: String;
          location?: String;
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
      (event) => event.untilDate === new Date().toDateString()
    ),
  }); */
    const newEvent = new Event({ ...req.body.dataToSave, id: Math.random() });
    await newEvent.save();
    res.json(await Event.find());
  }
);
