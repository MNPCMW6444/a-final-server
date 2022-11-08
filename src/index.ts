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
import { subscribtions } from "./types/enums";
import taskModel from "./models/taskModel";

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
  if (event.operationType === "delete")
    pubsub.publish(
      subscribtions.deletedEvent,
      event.documentKey._id.toString()
    );
  else if (event.operationType === "update") {
    const originalDocument = await EventModel.findById(
      event.documentKey._id.toString()
    );
    const parsedDocument = {
      ...originalDocument,
      _id: originalDocument?._id.toString(),
    };
    pubsub.publish(subscribtions.editEvent, {
      editEvent: parsedDocument,
    });
  } else
    event.operationType === "insert" &&
      pubsub.publish(subscribtions.newEvent, {
        newEvent: await EventModel.findById(event.documentKey._id.toString()),
      });
});

taskModel.watch().on("change", async (event) => {
  if (event.operationType === "delete")
    pubsub.publish(subscribtions.deletedTask, event.documentKey._id.toString());
  else if (event.operationType === "update") {
    const originalDocument = await TaskModel.findById(
      event.documentKey._id.toString()
    );
    const parsedDocument = {
      ...originalDocument,
      _id: originalDocument?._id.toString(),
    };
    pubsub.publish(subscribtions.editTask, {
      editTask: parsedDocument,
    });
  } else
    event.operationType === "insert" &&
      pubsub.publish(subscribtions.newTask, {
        newTask: await TaskModel.findById(event.documentKey._id.toString()),
      });
});
