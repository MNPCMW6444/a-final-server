import sslRedirect from "heroku-ssl-redirect";
import express from "express";
import cors from "cors";
const app = express();
const port = process.env.PORT || 5000;

app.use(sslRedirect());
app.listen(port, () => console.log(`Server started on port: ${port}`));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.get("/all", (req, res) => {
  res.josn({ asd: "asd" });
});
