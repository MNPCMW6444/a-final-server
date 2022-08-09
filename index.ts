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

app.post(
  "/saveTask",
  (
    req: {
      params: {
        dataToSave: {
          id: string;
          title: string;
          description: string;
          estimatedTime: string;
          status: string;
          priority: string;
          untilDate: string;
          "estimated Time"?: undefined;
          review?: undefined;
          timeSpent?: undefined;
        };
      };
    },
    res
  ) => {
    mock.tasks.push(req.params.dataToSave);
    res.json({
      events: mock.events.filter(
        (event) =>
          new Date(event["beginning Time"]).getDay() === new Date().getDay()
      ),
      tasks: mock.tasks.filter(
        (task) => task.untilDate === new Date().toDateString()
      ),
    });
  }
);

app.get(
  "/saveEvent",
  (
    req: {
      params: {
        dataToSave: {
          id: string;
          title: string;
          description: string;
          "beginning Time": string;
          "ending Time": string;
          color: string;
          invitedGuests: never[];
          "notification Time": string;
          "invited Guests"?: undefined;
        };
      };
    },
    res
  ) => {
    mock.events.push(req.params.dataToSave);
    res.json({
      events: mock.events.filter(
        (event) =>
          new Date(event["beginning Time"]).getDay() === new Date().getDay()
      ),
      tasks: mock.tasks.filter(
        (task) => task.untilDate === new Date().toDateString()
      ),
    });
  }
);
