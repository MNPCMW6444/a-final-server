import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.Promise = global.Promise;

const connection = mongoose.connect("" + process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

connection
  .then((db) => db)
  .catch((err) => {
    console.log(err);
  });

export default connection;
