import styled from 'styled-components';
import {Link, useLocation} from 'react-router-dom';

import Tag from '../Tag';

type Props = {
  leader?: any;
  participant: any;
  to: string;
  relationshipType: 'mentoring' | 'coaching';
  children?: JSX.Element;
};

const CardStyled = styled(Link)`
  background: #fff;
  border-radius: 12px;
  box-sizing: border-box;
  padding: 30px;
  box-shadow: 0 20px 24px -2px rgba(0, 0, 0, 0.14);
  width: 100%;
  text-decoration: none;
  z-index: 200;
  
  @media screen and (max-width: 540px) {
    padding: 14px;
  }
`;

const CardHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, max-content));
  grid-gap: 8px;
  align-items: center;
  margin-bottom: 12px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  display: block;
  overflow: hidden;
  border-radius: 50%;
  position: relative;
  box-sizing: border-box;
  
  img {
    position: absolute;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    object-fit: cover;
    object-position: center;
  }
`;

const Text = styled.p`
  font-weight: bold;
  font-size: 18px;
  color: black;
`;

const Card = ({ leader, participant, relationshipType, to, children }: Props) => {
  const location = useLocation();
  return (
    <CardStyled to={{
      pathname: to,
      state: { background: location },
    }}>
      <CardHeader>
        {
          !!leader &&
          <Avatar>
            <img src={leader.avatar} alt={`${leader.firstName}'s avatar`} />
          </Avatar>
        }
        <Avatar>
          <img src={participant.avatar} alt={`${participant.firstName}'s avatar`} />
        </Avatar>
      </CardHeader>
      {
        !!leader && <Text>{leader.firstName} {leader.lastName} &amp;</Text>
      }
      <Text>{participant.firstName} {participant.lastName}</Text>
      <Tag>{relationshipType}</Tag>
      {children}
    </CardStyled>
  );
}

export default Card;
