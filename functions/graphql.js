require('dotenv').config();

const { ApolloServer, gql } = require('apollo-server-lambda');
const jwt = require('jsonwebtoken');

const getPerson = require('./controller/getPerson');
const getPeople = require('./controller/getPeople');
const getRequest = require('./controller/getRequest');
const getRequests = require('./controller/getRequests');
const getRelationship = require('./controller/getRelationship');
const getRelationships = require('./controller/getRelationships');
const getLeaders = require('./controller/getLeaders');
const getEmail = require('./controller/getEmail');
const getPermissions = require('./controller/getPermissions');

const updateRequestAssignment = require('./controller/updateRequestAssignment');
const deleteRequest = require('./controller/deleteRequest');
const createRelationship = require('./controller/createRelationship');
const createSession = require('./controller/createSession');

const withAuth = require('./utils/withAuth');

const SECRET = process.env.SECRET;

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

  type DeleteRequest {
    deletedId: String!
  }

  type SessionMessage {
    message: String
  }

  type Query {
    person(id: String): Person
    people: [Person]
    leaders(relationshipType: RelationshipType): [Person]
    relationship(id: String): Relationship
    relationships: [Relationship]
    request(id: String): Request
    requests: [Request]
  }

  input UpdateAssignmentInput {
    id: String!
    assignment: Assignment!
    to: String!
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

  input CreateSessionInput {
    email: String!
  }

  type Mutation {
    updateAssignment(input: UpdateAssignmentInput!): Request
    deleteRequest(input: DeleteRequestInput!): DeleteRequest
    createRelationship(input: CreateRelationshipInput!): Relationship
    archiveRelationship(input: ArchiveRelationshipInput!): String
    createSession(input: CreateSessionInput!): SessionMessage
  }
`;

const resolvers = {
  Query: {
    person: withAuth(getPerson),
    people: withAuth(getPeople),
    requests: withAuth(getRequests),
    request: withAuth(getRequest),
    relationships: withAuth(getRelationships),
    relationship: withAuth(getRelationship),
    leaders: withAuth(getLeaders),
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
  Mutation: {
    updateAssignment: updateRequestAssignment,
    deleteRequest,
    createRelationship,
    createSession,
    // TODO: archive relationship
  },
};

const tryout = (cb) => {
  try {
    return [null, cb()];
  } catch (e) {
    return [e.name === 'TokenExpiredError' ? e.name : 'InvalidTokenError', null];
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event }) => {
    const header = event.headers.authorization;

    if (!header) return { auth: null };

    const [, token] = header.split(' ');
    const [err, data] = tryout(() => jwt.verify(token, SECRET));

    if (err) {
      console.error(err);
      return { auth: null };
    }

    const authScope = {
      ...data,
      permissions: await getPermissions(data.id),
    };

    authScope.canStillUseApp = authScope.permissions.filter(
      ({ name, allowed }) => name === 'has_app_access' && allowed,
    ).length;

    return {
      auth: authScope,
    };
  },
});

exports.handler = server.createHandler();
