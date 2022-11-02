export default `

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
  allTasks: [Task]
  allEvents: [Event]
}

type Mutation {
  editEvent(event: Event) : Event
  editTask(task: Task) : Task
  createTask(task: Task) : Task
  createEvent(event: Event) : Event
  deleteTask(_id: String) : Task
  deleteEvent(_id: String): Event
}

`;
