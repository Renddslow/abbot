import styled from 'styled-components';
import {Link} from 'react-router-dom';

type Props = {
  leader?: any;
  participant: any;
  to: string;
  relationshipType: 'mentoring' | 'coaching';
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

const Tag = styled.div<{ relationshipType: 'mentoring' | 'coaching' }>`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  box-sizing: border-box;
  color: #fff;
  background: ${props => props.relationshipType === 'mentoring' ? '#2d9d42' : '#f9ae05'};
  width: max-content;
  border-radius: 8px;
  margin-top: 8px;
`;

const upper = (p: string) => `${p[0].toUpperCase()}${p.slice(1)}`;

const Card = ({ leader, participant, relationshipType, to }: Props) => {
  return (
    <CardStyled to={to}>
      <CardHeader>
        {
          !!leader &&
          <Avatar>
            <img src={leader.data.attributes.avatar} />
          </Avatar>
        }
        <Avatar>
          <img src={participant.data.attributes.avatar} />
        </Avatar>
      </CardHeader>
      {
        !!leader && <Text>{leader.data.attributes.firstName} {leader.data.attributes.lastName} &amp;</Text>
      }
      <Text>{participant.data.attributes.firstName} {participant.data.attributes.lastName}</Text>
      <Tag relationshipType={relationshipType}>{upper(relationshipType)}</Tag>
    </CardStyled>
  );
}

export default Card;
