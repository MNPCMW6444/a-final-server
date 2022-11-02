import express from "express";
import bodyParser from "body-parser";
import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import mongoose from "mongoose";

import typeDefs from "./schema";
import resolvers from "./resolvers";

import Task from "./models/taskModel";

import Event from "./models/eventModel";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

mongoose.connect("mongodb://localhost:27017/finalProject");

const PORT = 4000;

const app = express();

app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({ schema, context: { Task, Event } })
);

app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.listen(PORT);
