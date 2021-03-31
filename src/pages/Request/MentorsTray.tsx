import { useContext, useState } from 'react';
import Spinner from '@atlaskit/spinner';
import { useQuery, gql, useMutation } from '@apollo/client';

import AssignmentCard from '../../components/AssignmentCard';
import { Person } from '../../types';
import Button from '../../components/Button';
import { Container, Grid, Column, Image } from './styled';
import UPDATE_ASSIGNMENT from './updateAssignmentMutation';

type Props = {
  requestId: string;
  relationshipType: 'mentoring' | 'coaching';
  onExit: (person: Person) => void;
};

const LEADERS = gql`
  query Leaders($type: RelationshipType!) {
    leaders(relationshipType: $type) {
      firstName
      lastName
      name
      avatar
      id
    }
  }
`;

const MentorsTray = (props: Props) => {
  const { data, loading } = useQuery(LEADERS, { variables: { type: props.relationshipType } });
  const [assign, { loading: assignmentLoading }] = useMutation(UPDATE_ASSIGNMENT);

  const onClick = (person: Person) => async () => {
    await assign({
      variables: {
        input: {
          id: props.requestId,
          assignment: 'pending',
          to: person.id,
        },
      },
    });
    props.onExit(person);
  };

  return (
    <Container>
      <h2>{props.relationshipType === 'mentoring' ? 'Mentors' : 'Coaches'}</h2>
      {loading ? (
        <Spinner />
      ) : (
        <Grid>
          {data.leaders.map((person: Person) => (
            <AssignmentCard key={person.id}>
              <Image>
                <img src={person.avatar} alt={`Avatar of ${person.name}`} />
              </Image>
              <Column>
                <h2>{person.name}</h2>
                {!assignmentLoading && (
                  <Button background="#36B37E" onClick={onClick(person)}>
                    Assign
                  </Button>
                )}
              </Column>
            </AssignmentCard>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MentorsTray;
