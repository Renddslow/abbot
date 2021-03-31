import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { get } from 'dot-prop';
import styled from 'styled-components';
import { useQuery, gql } from '@apollo/client';

import Modal from '../../components/Modal';
import Tag from '../../components/Tag';
import { TagRaw } from '../../components/Tag/Tag';
import MentorsTray from './MentorsTray';
import Assignment from './Assignment';

type Props = {
  match: {
    params: { id: string };
  };
};

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, max-content));
  grid-gap: 8px;
  align-items: center;

  ${TagRaw} {
    margin-top: 0;
  }
`;

const Datetime = styled.time`
  font-size: 12px;
  font-weight: 600;
`;

const List = styled.ul`
  list-style: none;
  padding-left: 22px;
  margin-top: 8px;
`;

const ListItem = styled.li<{ completed?: boolean }>`
  margin-bottom: 12px;
  position: relative;
  z-index: 0;

  &::before {
    content: ${(props) => (props.completed ? '"✓"' : '""')};
    width: 12px;
    height: 12px;
    border: 2px solid ${(props) => (props.completed ? '#36B37E' : '#ccc')};
    display: flex;
    border-radius: 50%;
    position: absolute;
    left: -22px;
    top: 3px;
    background: ${(props) => (props.completed ? '#36B37E' : '#fff')};
    z-index: -1;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 600;
  }

  &:not(:last-child)::after {
    content: '';
    height: calc(100% + 12px);
    top: 6px;
    width: 2px;
    background: ${(props) => (props.completed ? 'linear-gradient(#36B37E 60%, #ccc 60%)' : '#ccc')};
    display: block;
    position: absolute;
    left: -15px;
    z-index: -2;
  }
`;

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
            requestId={data.id}
            onExit={() => {
              setShowTray(false);
            }}
          />
        )
      }
      onExit={() => history.goBack()}
    >
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
    </Modal>
  );
};

export default Request;
