import styled from 'styled-components';
import {ReactChild} from 'react';

const statusColors = {
  pending: '#ffaf19',
  unassigned: '#ab92ee',
  assigned: '#2abe57',
};

type Props = {
  children: ReactChild;
};

const LabelStyled = styled.span<{ status: keyof typeof statusColors }>`
  padding: 6px 12px;
  color: #fff;
  text-transform: capitalize;
  background: ${(props) => statusColors[props.status]};
  font-size: 14px;
  border-radius: 8px;
`;

const Label = ({ children }: Props) => {
  return (
    <LabelStyled status={children as keyof typeof statusColors}>{children}</LabelStyled>
  );
};

export default Label;
