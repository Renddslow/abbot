export type RequestType = {
  type: 'request';
  id: string;
  attributes: {
    assignment: {
      to: string | null;
      status: 'unassigned' | 'rejected' | 'pending';
    };
    created: string;
    relationshipType: 'coaching' | 'mentoring';
  };
  relationships: {
    individual: {
      data: {
        id: string;
        type: 'person';
        attributes: {
          avatar: string;
          firstName: string;
          lastName: string;
          name: string;
          email: string;
        };
      }
    }
  }
};

export type Person = {
  id: string;
  type: 'person';
  attributes: {
    avatar: string;
    email: string;
    firstName: string;
    lastName: string;
    name: string;
  };
};
