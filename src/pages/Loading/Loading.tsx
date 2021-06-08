import styled, { keyframes } from 'styled-components';

const Main = styled.main`
  width: 100%;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: #41275d;
`;

const leap = keyframes`
  0% {
    top: 0;
  }
  
  20% {
    top: -8px;
    height: 10px;
  }
  
  25% {
    height: 20px;
  }
  
  28% {
    height: 30px;
  }
  
  35% {
    height: 10px;
    top: -50px;
  }
  
  50% {
    height: 10px;
    top: -50px;
  }
  
  70% {
    top: -42px;
  }
  
  85% {
    height: 10px;
    top: 0;
  }
  
  100% {
    top: 0;
  }
`;

const LoadingTotem = styled.div`
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 6px;
  position: absolute;
  bottom: 0;
  animation: ${leap} 1.5s ease-in-out infinite;
`;

const SpinnerContainer = styled.div`
  position: relative;
  margin-bottom: 24px;
  width: 106px;

  ${LoadingTotem}:nth-child(1) {
    left: 0;
    animation-delay: 0s;
  }

  ${LoadingTotem}:nth-child(2) {
    left: 24px;
    animation-delay: 0.1s;
  }

  ${LoadingTotem}:nth-child(3) {
    left: 48px;
    animation-delay: 0.2s;
  }

  ${LoadingTotem}:nth-child(4) {
    left: 72px;
    animation-delay: 0.3s;
  }

  ${LoadingTotem}:nth-child(5) {
    left: 96px;
    animation-delay: 0.4s;
  }
`;

const Container = styled.div`
  width: max-content;

  span {
    color: #fff;
    font-weight: 600;
    font-size: 18px;
    width: 100%;
    text-align: center;
    display: block;
  }
`;

const Loading = () => (
  <Main>
    <Container>
      <SpinnerContainer>
        <LoadingTotem />
        <LoadingTotem />
        <LoadingTotem />
        <LoadingTotem />
        <LoadingTotem />
      </SpinnerContainer>
      <span>relationships</span>
    </Container>
  </Main>
);

export default Loading;
