import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { get } from 'dot-prop';
import styled from 'styled-components';

import Modal from '../../components/Modal';
import withAPI from '../../utils/withAPI';
import { RequestType } from '../../types';
import Tag from '../../components/Tag';
import { TagRaw } from '../../components/Tag/Tag';
import Button from '../../components/Button';
import AssignmentCard from '../../components/AssignmentCard';
import MentorsTray from './MentorsTray';

type Props = {
  data: {
    data: RequestType;
  };
  loading: boolean;
  id: string;
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

const UnassignedCircle = styled.div`
  background: #545454;
  color: #fff;
  border-radius: 50%;
  display: flex;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 20px;
`;

const Column = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 8px;
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

const Request = ({ data, loading }: Props) => {
  const history = useHistory();
  const [showTray, setShowTray] = useState(false);

  const firstName = !loading
    ? get(data.data, 'relationships.individual.data.attributes.firstName', '')
    : '';
  const lastName = !loading
    ? get(data.data, 'relationships.individual.data.attributes.lastName', '')
    : '';
  const relationshipType = get(data, 'data.attributes.relationshipType', 'mentoring');

  const assignment = get(data, 'data.attributes.assignment', {} as { [key: string]: any });

  return (
    <Modal
      title={`${firstName} ${lastName}`}
      loading={loading}
      renderAside={() => (
        <>
          <h2>Next Steps</h2>
          <List>
            <ListItem completed={assignment.status !== 'unassigned'}>Assign person to mentor/coach</ListItem>
            <ListItem completed={assignment.status === 'accepted'}>Await acceptance of assignment</ListItem>
            <ListItem>Confirm accepted assignment and create relationship</ListItem>
          </List>
        </>
      )}
      renderActionRow={({ Link }) => (
        <Link
          href={`https://people.planningcenteronline.com/people/AC${get(
            data,
            'data.relationships.individual.data.id',
          )}`}
          target="_blank"
        >
          View Full Profile
        </Link>
      )}
      renderMetaRow={() => (
        <Row>
          <Tag>{relationshipType as 'mentoring' | 'coaching'}</Tag>
          <Datetime title={get(data, 'data.attributes.created', '2020-01-01')}>
            Open since{' '}
            {formatter.format(new Date(get(data, 'data.attributes.created', '2020-01-01')))}
          </Datetime>
        </Row>
      )}
      renderTray={() => showTray && (
        <MentorsTray
          relationshipType={relationshipType}
          requestId={data.data.id}
          onExit={() => {
            setShowTray(false);
          }}
        />
      )}
      onExit={() => history.goBack()}
    >
      <div>
        <h2>Assignment</h2>
        {
          assignment.status === 'unassigned' ?
            <AssignmentCard>
              <UnassignedCircle>?</UnassignedCircle>
              <Column>
                <h3>Unassigned</h3>
                {!showTray && (
                  <Button background="#0052CC" onClick={() => setShowTray(true)}>
                    Find {relationshipType === 'mentoring' ? 'Mentor' : 'Coach'}
                  </Button>
                )}
              </Column>
            </AssignmentCard> :
            <AssignmentCard />
        }
      </div>
    </Modal>
  );
};

export default withAPI(Request, {
  route: ({ match }) => `requests/${match.params.id}`,
  method: 'GET',
});
