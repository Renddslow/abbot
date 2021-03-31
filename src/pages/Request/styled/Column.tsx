import styled from 'styled-components';

const Column = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 8px;
`;

export default Column;
