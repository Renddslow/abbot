const { get } = require('dot-prop');

const { apiGet } = require('../utils/api');

const getRelationships = async () => {
  const [, data] = await apiGet('groups', `group_types/190252/groups`);
  return Promise.all(
    get(data, 'data', []).map(async ({ attributes, id }) => {
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
    }),
  );
};

module.exports = getRelationships;
