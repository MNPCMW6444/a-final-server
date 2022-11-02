"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `



type Event {
  title: String
  description: String
  beginningTime: String
  endingTime: String
  color: String
  invitedGuests: [String]
  location: String
  notificationTime: String
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
  untilDate: String
  review: String
  timeSpent: String
  location: String
  notificationTime: String
}

type Query {
  allTasks: [Task!]!
  allEvents: [Event!]!
}

type MutationTasks {
  createTask(name: String!): Task!
}
`;
