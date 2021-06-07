import styled from 'styled-components';

const Main = styled.main`
  width: 100%;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: #41275d;
`;

const LoadingTotem = styled.div`
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 4px;
`;

const SpinnerContainer = styled.div``;

const Container = styled.div`
  width: max-content;

  span {
    color: #fff;
    font-weight: 600;
    font-size: 16px;
  }
`;

const Loading = () => (
  <Main>
    <Container>
      <SpinnerContainer>
        <LoadingTotem />
      </SpinnerContainer>
      <span>relationships</span>
    </Container>
  </Main>
);

export default Loading;
