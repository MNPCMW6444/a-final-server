"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `

type Cat {
  _id: String!
  name: String!
}

type Query {
  allCats: [Cat!]!
}

type Mutation {
  createCat(name: String!): Cat!
}

`;
