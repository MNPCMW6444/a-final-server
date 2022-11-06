export default `#graphql

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
  allTasks: [Task]
  allEvents: [Event]
}

type Mutation {
  editEvent: Event
  editTask: Task
  createTask: Task
  createEvent: Event
  deleteTask: Task
  deleteEvent: Event
}

type Subscription {
  newEvent: Event
  newTask: Task
  deletedEvent: String
  deletedTask: String
}

`;
