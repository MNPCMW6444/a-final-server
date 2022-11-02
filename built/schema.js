"use strict";
exports.__esModule = true;
exports["default"] = "\n\ntype Cat {\n  _id: String!\n  name: String!\n}\n\ntype Query {\n  allCats: [Cat!]!\n}\n\ntype Mutation {\n  createCat(name: String!): Cat!\n}\n\n";
