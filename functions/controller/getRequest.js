const { apiGet } = require('../utils/api');
const { getDataShape, getAssignmentData } = require('./getRequests');

const getBoth = async (calls, names) => {
  const responses = await Promise.all(calls.map((c) => c()));
  const validIndex = responses.findIndex(([, data]) => !!data);
  return [responses[validIndex][1], names[validIndex]];
};

const getRequest = async (parent, args) => {
  const [data, type] = await getBoth(
    [
      () => apiGet('people', `workflows/264250/cards/${args.id}`),
      () => apiGet('people', `workflows/101579/cards/${args.id}`),
    ],
    ['mentoring', 'coaching'],
  );

  if (!data) {
    // TODO: 404
  }

  return getAssignmentData(getDataShape(type)(data.data));
};

module.exports = getRequest;
