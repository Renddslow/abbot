import styled from 'styled-components';

import PageHeader from '../../components/PageHeader';
import Table, { Header } from '../../components/Table';
import {gql, useQuery} from '@apollo/client';

type Response = {
  id: string;
  individual: {
    firstName: string;
    lastName: string;
  };
  created: string;
  relationshipType: 'mentoring' | 'coaching';
  assignment?: string;
}

const Uppercase = styled.span`
  text-transform: capitalize;
`;

const headers: Header[] = [
  {
    label: 'Name',
    type: 'person',
    key: 'name',
  },
  {
    label: 'Created',
    type: 'date',
    key: 'created',
  },
  {
    label: 'Type',
    type: 'label',
    key: 'relationshipType',
    component: ({ children }) => (<Uppercase>{children}</Uppercase>),
  },
  {
    label: 'Status',
    type: 'label',
    key: 'status',
    component: () => (<div />),
  },
  {
    label: 'Assignee',
    type: 'person',
    key: 'assignee',
    center: true,
    component: () => (<div />),
  },
];

const query = gql`
    query Relationships {
        relationships {
            id
            relationshipType
            created
            individual {
                firstName
                lastName
            }
        }
        requests {
            id
            relationshipType
            created
            assignment
            individual {
                firstName
                lastName
            }
        }
    }
`;

const f = new Intl.DateTimeFormat('en-UK', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const mergeAndFormat = (data: Record<string, any>) => {
  const formatter = (type: 'req' | 'rel') => (v: Response) => ({
    id: v.id,
    relationshipType: v.relationshipType,
    created: v.created,
    name: `${v.individual.firstName} ${v.individual.lastName}`,
    status: type === 'req' ? v.assignment : 'assigned',
  });
  return ([
    ...data.requests.map(formatter('req')),
    ...data.relationships.map(formatter('rel')),
  ]).sort((a, b) => {
    if (a.created > b.created) return 1;
    if (a.created < b.created) return -1;
    return 0;
  }).map(({ created, ...rest }) => ({
    ...rest,
    created: f.format(new Date(created)),
  }));
}

const Relationships = () => {
  const { data, loading } = useQuery(query);

  return (
    <section>
      <PageHeader>Relationships</PageHeader>
      <h2>My Assignments</h2>
      { !loading &&
        <Table
          title="Open Relationships"
          hasNew
          newLabel="+ New Relationship"
          headers={headers}
          actionColumn
          data={mergeAndFormat(data)}
        />
      }
    </section>
  );
};

export default Relationships;
