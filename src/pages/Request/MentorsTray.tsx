import {useContext, useState} from 'react';
import styled from 'styled-components';
import Spinner from '@atlaskit/spinner';

import withPagination from '../../utils/withPagination';
import AssignmentCard from '../../components/AssignmentCard';
import {Person} from '../../types';
import Button from '../../components/Button';
import {AuthContext} from '../../Auth';

type Props = {
  data: {
    data: Array<Person>;
  };
  requestId: string;
  loading: boolean;
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

const MentorsTray = (props: Props) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const { user } = useContext(AuthContext);

  const onClick = (person: Person) => async () => {
    setIsAssigning(true);
    if (!user) {
      throw Error();
    }

    await fetch(`https://abbot-api-auevpolm5q-uc.a.run.app/requests/${props.requestId}/assignment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        data: {
          id: props.requestId,
          type: 'assignment',
          attributes: {
            to: person.id,
            status: 'pending',
          },
        },
      }),
    });
    setIsAssigning(false);
    props.onExit(person);
  };

  return (
    <Container>
      <h2>{ props.relationshipType === 'mentoring' ? 'Mentors' : 'Coaches' }</h2>
      {
        props.loading ?
          <Spinner /> :
          <Grid>
            {
              props.data.data.map((person) => (
                <AssignmentCard>
                  <Image>
                    <img src={person.attributes.avatar} alt={`Avatar of ${person.attributes.name}`} />
                  </Image>
                  <Column>
                    <h2>{person.attributes.name}</h2>
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

export default withPagination(MentorsTray, {
  route: ({ relationshipType }) => relationshipType === 'mentoring' ? 'mentors' : 'coaches',
  method: 'GET',
});
