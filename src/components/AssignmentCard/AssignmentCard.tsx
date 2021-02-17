import styled from 'styled-components';

const AssignmentCard = styled.div`
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  padding: 12px;
  display: grid;
  grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
  grid-gap: 12px;
  align-items: center;
  margin-top: 8px;
`;

export default AssignmentCard;
