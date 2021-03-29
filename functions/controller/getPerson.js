const { apiGet } = require('../utils/api');

const getPerson = async (parent, args) => {
  const { id } = args;
  if (!id) return null;
  const [, data] = await apiGet('people', `people/${id}`);

  if (!data) {
    // TODO: 404
  }

  const { id: personId, attributes } = data.data;

  return {
    firstName: attributes.first_name,
    lastName: attributes.last_name,
    name: attributes.name,
    id: personId,
    avatar: attributes.avatar,
  };
};

module.exports = getPerson;
