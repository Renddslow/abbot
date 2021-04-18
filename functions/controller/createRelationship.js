const { get } = require('dot-prop');
const fauna = require('faunadb');
const cuid = require('cuid');

const { apiGet } = require('../utils/api');
const getRelationship = require('./getRelationship');

const q = fauna.query;
const client = new fauna.Client({ secret: process.env.FAUNA_KEY });

const createRelationship = async (parent, args) => {
  const [leader, member] = await Promise.all([
    apiGet('people', `people/${args.input.leaderId}`).then(([, d]) => d),
    apiGet('people', `people/${args.input.individualId}`).then(([, d]) => d),
  ]);

  const title = `[${args.input.relationshipType === 'mentoring' ? 'Mentoring' : 'Coaching'}] ${get(
    leader,
    'data.attributes.first_name',
  )}/${get(member, 'data.attributes.first_name')}`;

  const now = new Date().toISOString();

  const data = {
    id: cuid(),
    archived: false,
    meta: {},
    created: now,
    relationshipType: args.input.relationshipType,
    leader: args.input.leaderId,
    individual: args.input.individualId,
    name: title,
  };

  await client.query(q.Create(q.Collection('relationships'), { data }));

  return getRelationship({}, { id: data.id });
};

module.exports = createRelationship;
