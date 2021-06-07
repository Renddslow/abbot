import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ReactChild, SyntheticEvent } from 'react';

import Checkbox from '../../components/Checkbox';
import { withCheckboxes } from './Checkboxes';

type Props = {
  checked: boolean;
  onChange: (checked: boolean, e: SyntheticEvent) => void;
  children: ReactChild;
  id: string;
};

const Item = styled.div`
  display: grid;
  justify-content: start;
  grid-gap: 8px;
  align-items: center;
  grid-auto-flow: column;
  width: 240px;
`;

const StyledLink = styled(Link)`
  color: #32333a;
  display: flex;
  text-decoration: none;
  align-items: center;

  span {
    font-size: 16px;
    margin-left: 8px;
  }
`;

const Title = (props: Props) => {
  return (
    <Item>
      <Checkbox label="" labelHidden checked={props.checked} onChange={props.onChange} />
      <StyledLink to={`/relationships/${props.id}`}>{props.children}</StyledLink>
    </Item>
  );
};

export default withCheckboxes<Props>(Title);
