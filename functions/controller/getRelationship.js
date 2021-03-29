const { get } = require('dot-prop');

const { apiGet } = require('../utils/api');

const getRelationship = async (parent, args) => {
  const [, data] = await apiGet('groups', `groups/${args.id}`);

  if (!data) return null;

  const { id, attributes } = data.data;

  const [, members] = await apiGet('groups', `groups/${id}/people`);
  const leader = get(members, 'data', []).filter(
    ({ attributes }) => attributes.permissions === 'administrator',
  );
  const member = get(members, 'data', []).filter(
    ({ attributes }) => attributes.permissions !== 'administrator',
  );

  return {
    id,
    meta: attributes.description && JSON.parse(attributes.description),
    created: attributes.created_at,
    relationshipType: attributes.name.includes('[Coaching]') ? 'coaching' : 'mentoring',
    archived: !!attributes.archived_at,
    leader: get(leader, '0.id'),
    individual: get(member, '0.id'),
  };
};

module.exports = getRelationship;
