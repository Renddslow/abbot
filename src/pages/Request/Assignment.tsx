import React from 'react';
import { useMutation } from '@apollo/client';
import { UnassignedCircle, Circle, ButtonRow, Column } from './styled';

import Button from '../../components/Button';
import AssignmentCard from '../../components/AssignmentCard';
import UPDATE_ASSIGNMENT from './updateAssignmentMutation';

type Props = {
  assignment: any;
  id: string;
  leader: Record<string, any>;
  relationshipType: 'mentoring' | 'coaching';
  showTray: boolean;
  onClick: () => void;
};

const Assignment = ({ showTray, onClick, relationshipType, assignment, leader, id }: Props) => {
  const [update] = useMutation(UPDATE_ASSIGNMENT);

  const updateAssignment = (
    status: 'accepted' | 'pending' | 'declined' | 'unassigned' | 'rejected',
  ) => () =>
    update({
      variables: {
        input: {
          id,
          to: leader.id,
          assignment: status,
        },
      },
    });

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
          <ButtonRow>
            {assignment.status === 'accepted' ? (
              <Button background="#0052CC">Create Relationship</Button>
            ) : (
              <Button background="#36B37E">Accept</Button>
            )}
            <Button background="#FF5630" onClick={() => {}}>
              Decline
            </Button>
            <Button background="#0052CC" onClick={updateAssignment('unassigned')}>
              Unassign
            </Button>
          </ButtonRow>
        </Column>
      </>
    </AssignmentCard>
  );
};

export default Assignment;
