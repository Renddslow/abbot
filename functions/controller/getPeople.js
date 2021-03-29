const { apiGet } = require('../utils/api');

const getPeople = async (parent, args) => {
  const [, data] = await apiGet('people', `people`, args);

  return data.data.map(({ id, attributes }) => ({
    firstName: attributes.first_name,
    lastName: attributes.last_name,
    name: attributes.name,
    id: id,
    avatar: attributes.avatar,
  }));
};

module.exports = getPeople;
