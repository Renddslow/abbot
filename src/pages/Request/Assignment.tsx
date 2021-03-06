import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import Loading from '@atlaskit/spinner';
import dotProp from 'dot-prop';

import Button from '../../components/Button';
import AssignmentCard from '../../components/AssignmentCard';
import {get} from '../../utils/api';
import {AuthContext} from '../../Auth';
import { Person } from '../../types';

type Props = {
  assignment: any;
  id: string;
  relationshipType: 'mentoring' | 'coaching';
  showTray: boolean;
  onClick: () => void;
};

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

const Circle = styled.div`
  position: relative;
  display: flex;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
  }
`;

const Column = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 8px;
`;

const Row = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 6px;
  width: 100%;
  justify-content: start;
`;

const Assignment = ({ showTray, onClick, relationshipType, assignment, id }: Props) => {
  const [person, setPerson] = useState<Partial<Person>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  if (!user) {
    throw new Error();
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (id) {
      get(`people/${id}`, {}, user, signal)
        .then(([err, person]: [any | null, any | null]) => {
          setIsLoading(false);
          setPerson(person.data);
        });
    }

    return () => controller.abort();
  }, [user, id]);

  return (
    assignment.status === 'unassigned' ?
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
    </AssignmentCard> :
    <AssignmentCard>
      {
        !isLoading && person ?
          <>
            <Circle>
              <img src={person.attributes?.avatar} alt="Mentor/Coach avatar" />
            </Circle>
            <Column>
              <h3>{dotProp.get(person, 'attributes.firstName')} {dotProp.get(person, 'attributes.lastName')}</h3>
              <Row>
                {
                  assignment.status === 'accepted' ?
                    <Button background="#0052CC">
                      Create Relationship
                    </Button> :
                    <Button background="#36B37E">
                      Accept
                    </Button>
                }
                <Button background="#FF5630" onClick={() => {}}>
                  Decline
                </Button>
              </Row>
            </Column>
          </> :
          <Loading />
      }
    </AssignmentCard>
  )
};

export default Assignment;
