import sslRedirect from "heroku-ssl-redirect";
import express from "express";
import cors from "cors";
import mock from "./mock.json";

const app = express();
const port = process.env.PORT || 5001;

app.use(sslRedirect());
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

app.get("/tasks-all", (_, res) => {
  res.json({ tasks: mock.tasks, events: [] });
});

app.get("/events-all", (_, res) => {
  res.json({ events: mock.events, tasks: [] });
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
