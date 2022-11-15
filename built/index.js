"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const schema_1 = require("@graphql-tools/schema");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const resolvers_1 = __importDefault(require("./resolvers"));
const schema_2 = __importDefault(require("./schema"));
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default
    .connect("mongodb+srv://mnpcmw:cPUVRnT2exAgrles@cluster0.inulk.mongodb.net/finalProject?retryWrites=true&w=majority")
    .then(() => console.log("DB conn is good"));
const schema = (0, schema_1.makeExecutableSchema)({ typeDefs: schema_2.default, resolvers: resolvers_1.default });
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const wsServer = new ws_1.WebSocketServer({
    server: httpServer,
    path: "/graphql-subscriptions",
});
const serverCleanup = (0, ws_2.useServer)({ schema }, wsServer);
const server = new server_1.ApolloServer({
    schema,
    plugins: [
        (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
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
    app.use("/graphql", (0, cors_1.default)(), body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server));
    const PORT = 4000;
    httpServer.listen(PORT, () => {
        console.log(`Server is now running on http://localhost:${PORT}/graphql`);
    });
});
