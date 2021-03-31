const { get } = require('dot-prop');

const { apiGet, apiPost } = require('../utils/api');
const { getBoth } = require('./getRequest');
const { getDataShape, getAssignmentData } = require('./getRequests');

const message = (status) => {
  switch (status) {
    case 'accepted':
      return 'Accepted Assignment:';
    case 'pending':
      return 'Pending Assignment:';
    case 'rejected':
      return 'Assignment Declined:';
  }
};

const updateRequestAssignment = async (parent, args) => {
  const mentorUrl = `workflows/264250/cards/${args.input.id}`;
  const coachUrl = `workflows/101579/cards/${args.input.id}`;

  const [data, type] = await getBoth(
    [() => apiGet('people', mentorUrl), () => apiGet('people', coachUrl)],
    ['mentoring', 'coaching'],
  );

  const workflowId = get(data, 'data.relationships.workflow.data.id', '');

  const noteUrl = `workflows/${workflowId}/cards/${args.input.id}/notes`;
  const reqData = {
    type: 'WorkflowCardNote',
    attributes: {
      note:
        args.input.assignment === 'unassigned'
          ? 'No Assignment'
          : `${message(args.input.assignment)} ${args.input.to}`,
    },
  };

  await apiPost('people', noteUrl, { data: reqData });

  const [, cardData] = await apiGet('people', `workflows/${workflowId}/cards/${args.input.id}`);

  return getAssignmentData(getDataShape(type)(cardData.data));
};

module.exports = updateRequestAssignment;
