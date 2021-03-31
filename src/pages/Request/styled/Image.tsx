import styled from 'styled-components';

const Image = styled.div`
  border-radius: 50%;
  display: flex;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    object-fit: cover;
    object-position: center;
  }
`;

export default Image;
