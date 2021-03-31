import styled from 'styled-components';

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

export default Circle;
