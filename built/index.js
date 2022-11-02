"use strict";
exports.__esModule = true;
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var apollo_server_express_1 = require("apollo-server-express");
var graphql_tools_1 = require("graphql-tools");
var mongoose_1 = require("mongoose");
var schema_1 = require("./schema");
var resolvers_1 = require("./resolvers");
var taskModel_1 = require("./models/taskModel");
var eventModel_1 = require("./models/eventModel");
var schema = (0, graphql_tools_1.makeExecutableSchema)({
    typeDefs: schema_1["default"],
    resolvers: resolvers_1["default"]
});
mongoose_1["default"].connect("mongodb://localhost:27017/finalProject");
var PORT = 4000;
var app = (0, express_1["default"])();
app.use("/graphql", body_parser_1["default"].json(), (0, apollo_server_express_1.graphqlExpress)({ schema: schema, context: { Task: taskModel_1["default"], Event: eventModel_1["default"] } }));
app.use("/graphiql", (0, apollo_server_express_1.graphiqlExpress)({ endpointURL: "/graphql" }));
app.listen(PORT);
