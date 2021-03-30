const { get } = require('dot-prop');

const { apiGet, apiPost } = require('../utils/api');
const { getBoth } = require('./getRequest');

const deleteRequest = async (parent, args) => {
  const mentorUrl = `workflows/264250/cards/${args.input.id}`;
  const coachUrl = `workflows/101579/cards/${args.input.id}`;

  const [data] = await getBoth(
    [() => apiGet('people', mentorUrl), () => apiGet('people', coachUrl)],
    ['mentoring', 'coaching'],
  );

  if (!data) return null;

  const workflowId = get(data, 'data.relationships.workflow.data.id', '');

  await apiPost('people', `workflows/${workflowId}/cards/${args.input.id}/promote`);

  return { deletedId: args.input.id };
};

module.exports = deleteRequest;
