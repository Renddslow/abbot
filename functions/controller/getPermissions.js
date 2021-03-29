const { get } = require('dot-prop');

const { FIELDS, getFieldName } = require('./fields');
const { apiGet } = require('../utils/api');

const getPermissions = async (id) => {
  const [, data] = await apiGet('people', `people/${id}/field_data`, {
    where: {
      field_definition_id: Array.prototype.slice.call(Object.entries(FIELDS)).join(','),
    },
  });

  return get(data, 'data', []).map((datum) => {
    const id = get(datum, 'relationships.field_definition.data.id', '');
    return {
      id,
      allowed: get(datum, 'attributes.value') === 'true',
      name: getFieldName(id),
    };
  });
};

module.exports = getPermissions;
