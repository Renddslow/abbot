import React from 'react';
import styled from 'styled-components';

import Button from '../../components/Button';
import {ButtonRow} from './styled';

type Props = {
  assignment: 'accepted' | 'pending' | 'declined' | 'unassigned' | 'rejected';
  onClick: (assignment: 'accepted' | 'pending' | 'declined' | 'unassigned' | 'rejected' | 'create') => any;
};

type ButtonType = {
  id: 'accepted' | 'pending' | 'declined' | 'unassigned' | 'rejected' | 'create';
  type: 'button' | 'text';
  label: string;
  color: string;
};

const Text = styled.span`
  color: ${props => props.color};
  font-weight: 600;
`;

const ButtonRowComponent = ({ assignment, onClick }: Props) => {
  const buttons: ButtonType[] = [];

  if (assignment === 'accepted') {
    buttons.push({ type: 'button', id: 'create', label: 'Create Relationship', color: '#36B37E' });
  }

  if (assignment !== 'rejected' && assignment !== 'accepted') {
    buttons.push({ type: 'button', id: 'accepted', label: 'Accept', color: '#36B37E' });
    buttons.push({ type: 'button', id: 'rejected', label: 'Decline', color: '#FF5630' });
  }

  if (assignment === 'rejected') {
    buttons.push({ type: 'text', id: 'rejected', label: 'Declined', color: '#FF5630' });
  }

  buttons.push({ type: 'button', id: 'unassigned', label: 'Unassign', color: '#0052CC' });

  return (
    <ButtonRow>
      {
        buttons.map((btn) => (
          btn.type === 'button' ?
            <Button background={btn.color} key={btn.id} onClick={() => onClick(btn.id)}>{btn.label}</Button> :
            <Text key={btn.id} color={btn.color}>{btn.label}</Text>
        ))
      }
    </ButtonRow>
  );
};

export default ButtonRowComponent;
