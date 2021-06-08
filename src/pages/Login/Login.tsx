import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import styled, { keyframes, css } from 'styled-components';

import Input from '../../components/Input';
import Button from '../../components/Button';

const Main = styled.main`
  width: 100%;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: #41275d;
`;

const Card = styled.div`
  width: 95%;
  max-width: 320px;
  padding: 24px;
  display: block;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 12px 12px 0 rgba(0, 0, 0, 0.2);
`;

const Totem = styled.div`
  display: block;
  height: 10px;
  width: 10px;
  background: #41275d;
  border-radius: 50%;
  position: absolute;
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  
  100% {
    transform: rotate(365deg);
  }
`;

const kf = (direction: 'top' | 'right' | 'bottom' | 'left') => keyframes`
  0% {
    ${direction}: 0;
  }

  50% {
    ${direction}: 8px;
  }

  100% {
    ${direction}: 0;
  }
`;

const Logo = styled.div<{ isLoading: boolean }>`
  width: 48px;
  height: 48px;
  margin: 0 auto;
  position: relative;
  animation: ${({ isLoading }) =>
    isLoading &&
    css`
      ${spin} 2s linear infinite
    `};

  ${Totem}:nth-child(1) {
    top: 0;
    left: calc(50% - 5px);
    animation: ${({ isLoading }) =>
      isLoading &&
      css`
        ${kf('top')} 1s ease-in-out infinite
      `};
  }

  ${Totem}:nth-child(2) {
    left: calc(50% - 5px);
    bottom: 0;
    animation: ${({ isLoading }) =>
      isLoading &&
      css`
        ${kf('bottom')} 1s ease-in-out infinite
      `};
  }

  ${Totem}:nth-child(3) {
    left: 0;
    top: calc(50% - 5px);
    animation: ${({ isLoading }) =>
      isLoading &&
      css`
        ${kf('left')} 1s ease-in-out infinite
      `};
  }

  ${Totem}:nth-child(4) {
    top: calc(50% - 5px);
    right: 0;
    animation: ${({ isLoading }) =>
      isLoading &&
      css`
        ${kf('right')} 1s ease-in-out infinite
      `};
  }
`;

const HeaderText = styled.span`
  color: #41275d;
  font-weight: 600;
  font-size: 18px;
  width: 100%;
  text-align: center;
  display: block;
  margin-top: 16px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 24px;
`;

const Rule = styled.div`
  width: 85%;
  height: 1px;
  background: #e1e1e1;
  display: block;
  margin: 24px auto;
`;

const Row = styled.div`
  width: 100%;
  justify-content: end;
  display: grid;
`;

const LOGIN_MUTATION = gql`
  mutation Login($input: CreateSessionInput!) {
    createSession(input: $input) {
      message
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [createSession, { data, loading }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = () => {
    createSession({
      variables: {
        input: {
          email,
        },
      },
    });
  };

  return (
    <Main>
      <Card>
        <header>
          <Logo isLoading={loading}>
            <Totem />
            <Totem />
            <Totem />
            <Totem />
          </Logo>
          <HeaderText>relationships</HeaderText>
        </header>
        {!data ? (
          <>
            {!loading && (
              <>
                <Rule />
                <Form onSubmit={handleSubmit}>
                  <Input value={email} onChange={(v) => setEmail(v)} label="Email Address" />
                  <Row>
                    <Button>Login</Button>
                  </Row>
                </Form>
              </>
            )}
          </>
        ) : (
          <>
            <Rule />
            <span>{data.createSession.message}</span>
          </>
        )}
      </Card>
    </Main>
  );
};

export default Login;
