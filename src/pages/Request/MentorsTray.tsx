import {useContext, useState} from 'react';
import styled from 'styled-components';
import Spinner from '@atlaskit/spinner';

import AssignmentCard from '../../components/AssignmentCard';
import {Person} from '../../types';
import Button from '../../components/Button';
import {AuthContext} from '../../Auth';
import {useQuery, gql} from '@apollo/client';

type Props = {
  requestId: string;
  relationshipType: 'mentoring' | 'coaching';
  onExit: (person: Person) => void;
};

const Container = styled.div`
  width: 100%;
  display: grid;
  border-top: 1px solid #ccc;
  padding-top: 8px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: 12px;
`;

const Column = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 8px;
`;

const Image = styled.div`
  border-radius: 50%;
  display: flex;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    object-fit: cover;
    object-position: center;
  }
`;

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
  const [isAssigning, setIsAssigning] = useState(false);
  const { data, loading } = useQuery(LEADERS, { variables: { type: props.relationshipType } });
  const { user } = useContext(AuthContext);

  const onClick = (person: Person) => async () => {
    setIsAssigning(true);
    if (!user) {
      throw Error();
    }
    setIsAssigning(false);
    props.onExit(person);
  };

  return (
    <Container>
      <h2>{ props.relationshipType === 'mentoring' ? 'Mentors' : 'Coaches' }</h2>
      {
        loading ?
          <Spinner /> :
          <Grid>
            {
              data.leaders.map((person: Person) => (
                <AssignmentCard key={person.id}>
                  <Image>
                    <img src={person.avatar} alt={`Avatar of ${person.name}`} />
                  </Image>
                  <Column>
                    <h2>{person.name}</h2>
                    { !isAssigning && <Button background="#36B37E" onClick={onClick(person)}>Assign</Button> }
                  </Column>
                </AssignmentCard>
              ))
            }
          </Grid>
      }
    </Container>
  );
};

export default MentorsTray;
