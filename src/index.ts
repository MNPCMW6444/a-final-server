import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createServer } from "http";
import express from "express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import bodyParser from "body-parser";
import cors from "cors";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import mongoose from "mongoose";
import EventModel from "./models/eventModel";
import TaskModel from "./models/taskModel";
import { PubSub } from "graphql-subscriptions";

mongoose.connect(
  "mongodb+srv://mnpcmw:cPUVRnT2exAgrles@cluster0.inulk.mongodb.net/finalProject?retryWrites=true&w=majority"
);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql-subscriptions",
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

server.start().then(() => {
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server)
  );

  const PORT = 4000;

  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
  });
});

const pubsub = new PubSub();

EventModel.watch().on("change", async (event) => {
  event.operationType === "delete"
    ? pubsub.publish("deletedEvent", {
        deletedEvent: { _id: event.documentKey._id.toString() },
      })
    : event.operationType === "update"
    ? pubsub.publish("editedTask", {
        editedTask: await EventModel.findById(event.documentKey._id.toString()),
      })
    : pubsub.publish("newEvent", {
        newEvent: await EventModel.findById(event.documentKey._id.toString()),
      });
});

TaskModel.watch().on("create", (event) => {
  console.log(event);
  /*  pubsub.asyncIterator("newTask");
  pubsub.asyncIterator("editTask");
  pubsub.asyncIterator("deletedTask"); */
});
