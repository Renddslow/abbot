const { get } = require('dot-prop');

const { apiGet } = require('../utils/api');

const getDataShape = (relationshipType) => (request) => ({
  id: request.id,
  created: request.attributes.created_at,
  relationshipType,
  workflowId: relationshipType === 'mentoring' ? 264250 : 101579,
  individual: get(request, 'relationships.person.data.id'),
});

const getStatus = (status) => {
  if (status.includes('accepted')) return 'accepted';
  if (status.includes('pending')) return 'pending';
  if (status.includes('declined')) return 'rejected';
  return 'unassigned';
};

const getAssignmentStatus = (note) => {
  if (!note) {
    return { status: 'unassigned', to: null };
  }

  const noteData = get(note, 'attributes.note', '');
  const [status, to] = noteData.split(': ');

  if (status && to) {
    return {
      status: getStatus(status.toLowerCase()),
      to,
    };
  }

  return { status: 'unassigned', to: null };
};

const getAssignmentData = async ({ workflowId, ...request }) => {
  const [, notes] = await apiGet('people', `workflows/${workflowId}/cards/${request.id}/notes`);

  const sortedNotes = notes.data.sort((a, b) => {
    if (a.attributes.created_at > b.attributes.created_at) return -1;
    if (a.attributes.created_at < b.attributes.created_at) return 1;
    return 0;
  });
  const note = sortedNotes.find(({ attributes }) => attributes.note.includes('Assignment'));
  const { to, status } = getAssignmentStatus(note);

  return {
    ...request,
    assignment: status,
    leader: to || null,
  };
};

const getRequests = async () => {
  const [mentorRequest, coachRequest] = (
    await Promise.all([
      apiGet('people', 'workflows/264250/cards', {
        where: {
          step_id: '649219',
          stage: 'ready',
        },
      }),
      apiGet('people', 'workflows/101579/cards', {
        where: {
          step_id: '267426',
          stage: 'ready',
        },
      }),
    ])
  ).map(([, data]) => (data ? data.data : []));

  return Promise.all(
    [
      ...mentorRequest.map(getDataShape('mentoring')),
      ...coachRequest.map(getDataShape('coaching')),
    ].map(getAssignmentData),
  );
};

module.exports = getRequests;
module.exports.getDataShape = getDataShape;
module.exports.getAssignmentData = getAssignmentData;
