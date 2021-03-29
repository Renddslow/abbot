const { get } = require('dot-prop');

const { apiGet } = require('../utils/api');

const getEmail = async (id) => {
  const [, email] = await apiGet('people', `people/${id}/emails`, {
    where: {
      primary: true,
    },
  });

  return get(email, 'data.0.attributes.address', '');
};

module.exports = getEmail;
