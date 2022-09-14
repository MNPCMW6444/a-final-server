"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mock_json_1 = __importDefault(require("./mock.json"));
const taskModel_1 = __importDefault(require("./models/taskModel"));
const eventModel_1 = __importDefault(require("./models/eventModel"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5001;
app.use(express_1.default.json());
app.listen(port, () => console.log(`Server started on port: ${port}`));
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://finalproject.flexboxtorchy.com"],
    credentials: true,
}));
dotenv_1.default.config();
mongoose_1.default.connect("" + process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err)
        return console.error(err);
    console.log("Connected to Main MongoDB");
});
app.get("/alldata", async (_, res) => {
    res.json(mock_json_1.default);
    //res.json({ tasks: await Task.find() });
});
app.get("/tasks-all", async (_, res) => {
    // res.json({ tasks: mock.tasks, events: [] });
    res.json({ tasks: await taskModel_1.default.find() });
});
app.get("/events-all", async (_, res) => {
    // res.json({ events: mock.events, tasks: [] });
    res.json({ events: await eventModel_1.default.find() });
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
    const todayBeginnig = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    res.json({
        tasks: await taskModel_1.default.find({ estimatedTime: { $gte: todayBeginnig } }),
        events: await eventModel_1.default.find({ beginningTime: { $gte: todayBeginnig } }),
    });
});
app.post("/saveTask", async (req, res) => {
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
    const newTask = new taskModel_1.default({ ...req.body.dataToSave });
    await newTask.save();
    res.json(await taskModel_1.default.find());
});
app.post("/saveEvent", async (req, res) => {
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
    const newEvent = new eventModel_1.default({ ...req.body.dataToSave });
    await newEvent.save();
    res.json(await eventModel_1.default.find());
});
app.put("/saveTask", async (req, res) => {
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
    const editedTask = await taskModel_1.default.findById(req.body.id);
    if (editedTask === null)
        res.status(400);
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
});
app.put("/saveEvent", async (req, res) => {
    const editedEvent = await eventModel_1.default.findById(req.body.id);
    if (editedEvent === null)
        res.status(400);
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
});
app.delete("/events/:id", async (req, res) => {
    const event = await eventModel_1.default.findById(req.params.id);
    if (event)
        await event.delete();
    res.json(await eventModel_1.default.find());
});
app.delete("/tasks/:id", async (req, res) => {
    const task = await taskModel_1.default.findById(req.params.id);
    if (task)
        await task.delete();
    res.json(await taskModel_1.default.find());
});
