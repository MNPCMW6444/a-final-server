"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
//import mock from "./assets/mock.json";
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
    //res.json(mock);
    res.json({ tasks: await taskModel_1.default.find(), events: await eventModel_1.default.find() });
});
app.put("/editEvent/:id", async (req, res) => {
    const oldEvent = await eventModel_1.default.findById(req.params.id);
    const newEvent = req.body.newItem;
    Object.keys(newEvent).forEach((key) => {
        if (key !== "_id")
            oldEvent[key] = newEvent[key];
    });
    const resAved = oldEvent && (await oldEvent.save());
    res.json(resAved);
});
app.put("/editTask/:id", async (req, res) => {
    const oldTask = await taskModel_1.default.findById(req.params.id);
    const newTask = req.body.newItem;
    Object.keys(newTask).forEach((key) => {
        if (key !== "_id")
            oldTask[key] = newTask[key];
    });
    const resAved = oldTask && (await oldTask.save());
    res.json(resAved);
});
