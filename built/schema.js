"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `

type Event 
{
  id :Number
    type: String
    
    
  
  title: String
    
  
  description: String
    
  
  beginningTime: Date
    
  
  endingTime: Date
    
  
  color: String
    
  
  invitedGuests: [String]
    
  
  location: String
    
  
  notificationTime: Date
    
}

type Query {
  allEvents: [Event!]!
}

type Mutation {
  createEvent(name: String!): Event!
}

`;
