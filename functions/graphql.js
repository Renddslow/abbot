require('dotenv').config();

const { ApolloServer, gql } = require('apollo-server-lambda');

const getPerson = require('./controller/getPerson');
const getPeople = require('./controller/getPeople');
const getRequest = require('./controller/getRequest');
const getRequests = require('./controller/getRequests');
const getEmail = require('./controller/getEmail');
const getPermissions = require('./controller/getPermissions');

const typeDefs = gql`
  type Permission {
    id: String
    allowed: Boolean
    name: String
  }

  enum RelationshipType {
    coaching
    mentoring
  }

  enum Assignment {
    accepted
    pending
    declined
    unassigned
    rejected
  }

  type Relationship {
    id: String!
    meta: String
    created: String!
    relationshipType: RelationshipType!
    archived: Boolean!
    leader: Person!
    individual: Person!
  }

  type Request {
    id: String!
    created: String!
    relationshipType: RelationshipType!
    assignment: Assignment!
    leader: Person
    individual: Person!
  }

  type Person {
    id: String
    firstName: String
    lastName: String
    email: String
    name: String
    avatar: String
    permissions: [Permission]
  }

  enum PersonType {
    mentor
    coach
  }

  type Query {
    person(id: String): Person
    people(type: PersonType): [Person]
    relationship(id: String): Relationship
    relationships: [Relationship]
    request(id: String): Request
    requests: [Request]
  }

  input UpdateAssignmentInput {
    id: String
    assignment: Assignment
  }

  input DeleteRequestInput {
    id: String
  }

  input CreateRelationshipInput {
    individualId: String
    leaderId: String
    relationshipType: RelationshipType
  }

  input ArchiveRelationshipInput {
    id: String
  }

  type Mutation {
    updateAssignment(input: UpdateAssignmentInput!): Request
    deleteRequest(input: DeleteRequestInput!): String
    createRelationship(input: CreateRelationshipInput!): Relationship
    archiveRelationship(input: ArchiveRelationshipInput!): String
  }
`;

const resolvers = {
  Query: {
    person: getPerson,
    people: getPeople,
    requests: getRequests,
    request: getRequest,
  },
  Person: {
    email: (parent) => getEmail(parent.id),
    permissions: (parent) => getPermissions(parent.id),
  },
  Relationship: {
    leader: (parent) => getPerson({}, { id: parent.leader }),
    individual: (parent) => getPerson({}, { id: parent.individual }),
  },
  Request: {
    leader: (parent) => getPerson({}, { id: parent.leader }),
    individual: (parent) => getPerson({}, { id: parent.individual }),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler();
