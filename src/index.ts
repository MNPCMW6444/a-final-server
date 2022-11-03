import mongoose from "mongoose";

import typeDefs from "./schema";
import resolvers from "./resolvers";

import Task from "./models/taskModel";
import Event from "./models/eventModel";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

mongoose.connect("mongodb://localhost:27017/finalProject");

const PORT = 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: PORT },
}).then((res) => console.log("Server up on " + res.url));
