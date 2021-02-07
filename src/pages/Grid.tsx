import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20px;
  margin-top: 24px;
  
  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default Grid;
