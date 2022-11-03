import mongoose from "mongoose";

import typeDefs from "./schema";
import resolvers from "./resolvers";

import Task from "./models/taskModel";
import Event from "./models/eventModel";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import express from "express";

mongoose.connect("mongodb://localhost:27017/finalProject");

const PORT = 4000;
/* 
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

 */
const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: "/graphql",
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.

const schema = makeExecutableSchema({ typeDefs, resolvers });

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
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

startStandaloneServer(server, {
  listen: { port: PORT },
}).then((res) => console.log("Server up on " + res.url));
