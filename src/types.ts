export type RequestType = {
  id: string;
  assignment: 'unassigned' | 'rejected' | 'pending';
  created: string;
  relationshipType: 'coaching' | 'mentoring';
  leader: Person;
  individual: Person;
};

export type Person = {
  id: string;
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
};
