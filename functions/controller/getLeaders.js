const { get } = require('dot-prop');

const { apiGet } = require('../utils/api');
const getPerson = require('./getPerson');

const getLeaders = async (parent, args) => {
  const { type, ...rest } = args;

  const definitionId = type === 'mentoring' ? '430800' : '430799';
  const [, data] = await apiGet('people', `field_data`, {
    ...rest,
    where: {
      field_definition_id: definitionId,
      value: 'true',
    },
  });

  if (!data) {
    return null;
  }

  return Promise.all(
    data.data.map(({ relationships }) =>
      getPerson({}, { id: get(relationships, 'customizable.data.id') }),
    ),
  );
};

module.exports = getLeaders;
