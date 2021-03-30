const { get } = require('dot-prop');

const { apiGet, apiPost } = require('../utils/api');
const getRelationship = require('./getRelationship');
const { createGroup } = require('./createGroup');

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

  const groupId = await createGroup(title);

  await Promise.all([
    apiPost('groups', `groups/${groupId}/memberships`, {
      data: {
        attributes: {
          person_id: leader.data.id,
          role: 'leader',
          joined_at: now,
        },
      },
    }),
    apiPost('groups', `groups/${groupId}/memberships`, {
      data: {
        attributes: {
          person_id: member.data.id,
          role: 'member',
          joined_at: now,
        },
      },
    }),
  ]);

  return getRelationship({}, { id: groupId });
};

module.exports = createRelationship;
