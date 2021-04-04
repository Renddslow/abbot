import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { get } from 'dot-prop';
import { useQuery, gql } from '@apollo/client';

import Modal from '../../components/Modal';
import Tag from '../../components/Tag';
import MentorsTray from './MentorsTray';
import Assignment from './Assignment';
import { Datetime, ListItem, List, Row } from './styled';
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
  query Request($id: String!) {
    request(id: $id) {
      id
      created
      leader {
        id
        firstName
        lastName
        avatar
      }
      relationshipType
      assignment
      individual {
        id
        firstName
        lastName
      }
    }
  }
`;

const Request = ({ match }: Props) => {
  const history = useHistory();
  const [showTray, setShowTray] = useState(false);
  const { data, loading } = useQuery(REQUEST, { variables: { id: match.params.id } });

  const firstName = get(data, 'request.individual.firstName', '');
  const lastName = get(data, 'request.individual.lastName', '');
  const relationshipType = get(data, 'request.relationshipType');
  const assignment = get(data, 'request.assignment', '' as 'unassigned' | 'rejected' | 'pending' | 'accepted' | '');

  return (
    <Modal
      title={`${firstName} ${lastName}`}
      loading={loading}
      renderAside={() => (
        <>
          <h2>Next Steps</h2>
          <List>
            <ListItem completed={assignment !== 'unassigned'}>
              Assign person to mentor/coach
            </ListItem>
            <ListItem completed={assignment === 'accepted'}>
              Await acceptance of assignment
            </ListItem>
            <ListItem>Confirm accepted assignment and create relationship</ListItem>
          </List>
        </>
      )}
      renderActionRow={({ Link }) => (
        <Link
          href={`https://people.planningcenteronline.com/people/AC${get(
            data,
            'request.individual.id',
          )}`}
          target="_blank"
        >
          View Full Profile
        </Link>
      )}
      renderMetaRow={() => (
        <Row>
          <Tag>{relationshipType as 'mentoring' | 'coaching'}</Tag>
          <Datetime title={get(data, 'request.created', '2020-01-01')}>
            Open since {formatter.format(new Date(get(data, 'request.created', '2020-01-01')))}
          </Datetime>
        </Row>
      )}
      renderTray={() =>
        showTray && (
          <MentorsTray
            relationshipType={relationshipType as 'mentoring' | 'coaching' }
            requestId={get(data, 'request.id', '')}
            onExit={() => {
              setShowTray(false);
            }}
          />
        )
      }
      onExit={() => history.goBack()}
    >
      <>
        <div>
          <h2>Assignment</h2>
          <Assignment
            id={get(data, 'request.id', '')}
            leader={get(data, 'request.leader', {})}
            assignment={assignment}
            relationshipType={relationshipType as 'mentoring' | 'coaching'}
            showTray={showTray}
            onClick={() => setShowTray(true)}
          />
        </div>
        <div>
          { assignment !== 'unassigned' && <Button background="" blackText>Notify {relationshipType === 'mentoring' ? 'Mentor' : 'Coach'}</Button> }
        </div>
      </>
    </Modal>
  );
};

export default Request;
