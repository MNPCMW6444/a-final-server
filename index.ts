import express from "express";
import cors from "cors";
//import mock from "./assets/mock.json";
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
  //res.json(mock);
  res.json({ tasks: await Task.find(), events: await Event.find() });
});

app.put("/editEvent/:id", async (req, res) => {
  const oldEvent = await Event.findById(req.params.id);
  const newEvent = req.body.newItem;
  Object.keys(newEvent).forEach((key) => {
    if (key !== "_id") (oldEvent as unknown as any)[key] = newEvent[key];
  });
  const resAved = oldEvent && (await oldEvent.save());
  res.json(resAved);
});

app.put("/editTask/:id", async (req, res) => {
  const oldTask = await Task.findById(req.params.id);
  const newTask = req.body.newItem;
  Object.keys(newTask).forEach((key) => {
    if (key !== "_id") (oldTask as unknown as any)[key] = newTask[key];
  });
  const resAved = oldTask && (await oldTask.save());
  res.json(resAved);
});

app.post("/createTask", async (req, res) => {
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
});

app.post("/createEvent", async (req, res) => {
  const title = req.body.newItem.title;
  const description = req.body.newItem.description;
  const beginningTime = new Date(req.body.newItem.beginningTime);
  const endingTime = new Date(req.body.newItem.endingTime);
  const color = req.body.newItem.color;
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
});
