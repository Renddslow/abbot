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

const getRequests = async () => {
  const [mentorRequest, coachRequest] = (
    await Promise.all([
      apiGet('people', 'workflows/264250/cards'),
      apiGet('people', 'workflows/101579/cards'),
    ])
  ).map(([, data]) => (data ? data.data : []));

  return Promise.all(
    [
      ...mentorRequest.map(getDataShape('mentoring')),
      ...coachRequest.map(getDataShape('coaching')),
    ].map(async ({ workflowId, ...request }) => {
      const [, notes] = await apiGet('people', `workflows/${workflowId}/cards/${request.id}/notes`);

      notes.data.reverse();
      const note = notes.data.find(({ attributes }) => attributes.note.includes('Assignment'));
      const { to, status } = getAssignmentStatus(note);

      return {
        ...request,
        assignment: status,
        leader: to,
      };
    }),
  );
};

module.exports = getRequests;
