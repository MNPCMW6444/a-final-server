"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;
// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        hello: () => "world",
    },
};
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers,
});
(0, standalone_1.startStandaloneServer)(server).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
