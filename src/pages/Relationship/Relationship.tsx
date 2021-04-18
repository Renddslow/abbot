import React from 'react';
import { useHistory } from 'react-router';
import { get } from 'dot-prop';
import { useQuery, gql } from '@apollo/client';

import Modal from '../../components/Modal';
import Tag from '../../components/Tag';
import Button from '../../components/Button';

type Props = {
  match: {
    params: { id: string };
  };
};

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const REQUEST = gql`
    query Relationship($id: String!) {
        relationship(id: $id) {
            id
            created
            meta
            leader {
                id
                firstName
                lastName
                avatar
            }
            relationshipType
            individual {
                id
                firstName
                lastName
            }
        }
    }
`;

const Relationship = ({ match }: Props) => {
  const history = useHistory();
  const { data, loading } = useQuery(REQUEST, { variables: { id: match.params.id } });

  const individual: Record<string, any> = get(data, 'relationship.individual', {});
  const leader: Record<string, any> = get(data, 'relationship.leader', {});

  return (
    <Modal
      title={individual && leader ? `${individual.firstName} ${individual.lastName}` : ''}
      loading={loading}
      renderAside={() => (
        <div />
      )}
      renderActionRow={({ Link }) => (
        <Link
          href={`https://people.planningcenteronline.com/people/AC${get(
            data,
            'relationship.individual.id',
          )}`}
          target="_blank"
        >
          View Full Profile
        </Link>
      )}
      renderMetaRow={() => (<div />)}
      onExit={() => history.push('/relationships')}
    >
      <>
        <div>
          Hello
        </div>
      </>
    </Modal>
  );
};

export default Relationship;
