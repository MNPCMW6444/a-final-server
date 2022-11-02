"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const apollo_server_express_1 = require("apollo-server-express");
const graphql_tools_1 = require("graphql-tools");
const mongoose_1 = __importDefault(require("mongoose"));
const schema_1 = __importDefault(require("./schema"));
const resolvers_1 = __importDefault(require("./resolvers"));
const taskModel_1 = __importDefault(require("./models/taskModel"));
const eventModel_1 = __importDefault(require("./models/eventModel"));
const schema = (0, graphql_tools_1.makeExecutableSchema)({
    typeDefs: schema_1.default,
    resolvers: resolvers_1.default,
});
mongoose_1.default.connect("mongodb://localhost:27017/finalProject");
const PORT = 4000;
const app = (0, express_1.default)();
app.use("/graphql", body_parser_1.default.json(), (0, apollo_server_express_1.graphqlExpress)({ schema, context: { Task: taskModel_1.default, Event: eventModel_1.default } }));
app.use("/graphiql", (0, apollo_server_express_1.graphiqlExpress)({ endpointURL: "/graphql" }));
app.listen(PORT);
