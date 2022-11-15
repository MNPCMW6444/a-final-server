"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeDefs = `
  scalar Date

  type Event {
    _id: String!
    title: String!
    description: String!
    beginningTime: Date!
    endingTime: Date!
    color: String!
    invitedGuests: [String]
    location: String
    notificationTime: Date
  }

  type Task {
    _id: String!
    title: String!
    description: String!
    estimatedTime: String!
    status: String!
    priority: String!
    untilDate: Date
    review: String
    timeSpent: String
  }

  input EventInput {
    _id: String
    title: String!
    description: String!
    beginningTime: Date!
    endingTime: Date!
    color: String!
    invitedGuests: [String]
    location: String
    notificationTime: Date
    type: String
  }

  input TaskInput {
    _id: String
    title: String!
    description: String!
    estimatedTime: String!
    status: String!
    priority: String!
    untilDate: Date
    review: String
    timeSpent: String
    type: String
  }


  type Query {
    allTasks: [Task]
    allEvents: [Event]
  }

  type Mutation {
    editEvent(newItem: EventInput): Event
    editTask(newItem: TaskInput): Task
    createTask(newItem: TaskInput):  Task
    createEvent(newItem: EventInput): Event
    deleteTask(id: String):  String
    deleteEvent(id: String): String
  }

  type EventMutation {
    type: String!
    event: Event
    id: String
  }

  type TaskMutation {
    type: String!
    task: Task
    id: String
  }

  type Subscription {
    eventMutation: EventMutation
    taskMutation: TaskMutation
  }
`;
exports.default = typeDefs;
