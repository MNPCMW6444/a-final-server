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

app.get("/all", (req, res) => {
  res.json(mock);
});
