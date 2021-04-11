import React, {useEffect} from 'react';
import { useMutation, gql } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { UnassignedCircle, Circle, Column } from './styled';
import Button from '../../components/Button';
import AssignmentCard from '../../components/AssignmentCard';
import UPDATE_ASSIGNMENT from './updateAssignmentMutation';
import ButtonRow from './ButtonRow';

type Props = {
  assignment: any;
  id: string;
  leader: Record<string, any>;
  individual: Record<string, any>;
  relationshipType: 'mentoring' | 'coaching';
  showTray: boolean;
  onClick: () => void;
};

const CREATE_RELATIONSHIP = gql`
    mutation CreateRelationships($input: CreateRelationshipInput!) {
        createRelationship(input: $input) {
            id
        }
    }
`;

const DELETE_REQUEST = gql`
    mutation DeleteRequest($input: DeleteRequestInput!) {
        deleteRequest(input: $input) {
            deletedId
        }
    }
`;

const Assignment = ({ showTray, onClick, relationshipType, assignment, leader, id, individual }: Props) => {
  const [update, { loading: updateLoading }] = useMutation(UPDATE_ASSIGNMENT);
  const [create, { loading: createLoading, data }] = useMutation(CREATE_RELATIONSHIP);
  const [del, { loading: deleteLoading }] = useMutation(DELETE_REQUEST);
  const history = useHistory();

  console.log(data);

  const loading = createLoading || updateLoading || deleteLoading;

  const updateAssignment = (
    status: 'accepted' | 'pending' | 'declined' | 'unassigned' | 'rejected' | 'create',
  ) => {
    if (status !== 'create') {
      return update({
        variables: {
          input: {
            id,
            to: leader.id,
            assignment: status,
          },
        },
      })
    } else {
      return create({
        variables: {
          input: {
            individualId: individual.id,
            leaderId: leader.id,
            relationshipType,
          },
        },
      }).then(() => del({
          variables: {
            input: {
              id,
            },
          },
        }));
    }
  };

  useEffect(() => {
    if (data && data.createRelationship) {
      history.push(`/relationships/${data.createRelationship.id}`)
    }
  }, [data, history])

  return assignment === 'unassigned' ? (
    <AssignmentCard>
      <UnassignedCircle>?</UnassignedCircle>
      <Column>
        <h3>Unassigned</h3>
        {!showTray && (
          <Button background="#0052CC" onClick={onClick}>
            Find {relationshipType === 'mentoring' ? 'Mentor' : 'Coach'}
          </Button>
        )}
      </Column>
    </AssignmentCard>
  ) : (
    <AssignmentCard>
      <>
        <Circle>
          <img src={leader.avatar} alt="Mentor/Coach avatar" />
        </Circle>
        <Column>
          <h3>
            {leader.firstName} {leader.lastName}
          </h3>
          {!loading ? <ButtonRow onClick={updateAssignment} assignment={assignment} /> : <div />}
        </Column>
      </>
    </AssignmentCard>
  );
};

export default Assignment;
