export default `

scalar DateTime

type Event {
  title: String
  description: String
  beginningTime: DateTime
  endingTime: DateTime
  color: String
  invitedGuests: [String]
  location: String
  notificationTime: DateTime
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
  untilDate: DateTime
  review: String
  timeSpent: String
  location: String
  notificationTime: DateTime
}

type Query {
  allTasks: [Task!]!
  allEvents: [Event!]!
}

type MutationTasks {
  createTask(name: String!): Task!
}
`;
