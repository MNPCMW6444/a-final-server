"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `

scalar Date

type Event {
  title: String
  description: String
  beginningTime: Date
  endingTime: Date
  color: String
  invitedGuests: [String]
  location: String
  notificationTime: Date
}

type QueryEvents {
  allEvents: [Event!]!
}

type MutationEvents {
  createEvents(name: String!): Event!
}

type Task {
  title: String
  description: String
  estimatedTime: String
  status: String
  priority: String
  untilDate: Date
  review: String
  timeSpent: String
  location: String
  notificationTime: Date
}

type Query {
  allTasks: [Task!]!
}

type MutationTasks {
  createTask(name: String!): Task!
}
`;
