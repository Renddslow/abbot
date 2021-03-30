import styled from 'styled-components';
import Form, {Field, FormFooter} from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import { useMutation, gql } from '@apollo/client';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin: 102px auto 24px;
  width: 400px;
  padding: 32px 40px;
  background: rgb(255, 255, 255);
  border-radius: 3px;
  box-shadow: rgb(0 0 0 / 10%) 0 0 10px;
  box-sizing: border-box;
  color: rgb(94, 108, 132);
`;

const FlexContainer = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: minmax(0, max-content);
  width: 100%;
`;

const CREATE_SESSION = gql`
    mutation CreateSession($input: CreateSessionInput!) {
        createSession(input: $input) {
            message
        }
    }
`;

const Login = () => {
  const [sendMutation, { data, loading }] = useMutation(CREATE_SESSION);

  const onSubmit = async (state: any) => {
    sendMutation({ variables: { input: { email: state.email } } });
  };

  return (
    <Container>
      <div>
        <div>Log in to continue to:</div>
        <div>Relationships</div>
      </div>
      {
        data ?
          <div>{data.createSession.message}</div> :
          <Form onSubmit={onSubmit}>
            {({ formProps }) => (
              <form {...formProps}>
                <Field label="Email Address" defaultValue="" name="email" isDisabled={loading}>
                  {({ fieldProps }) => (
                    <Textfield {...fieldProps} />
                  )}
                </Field>
                <FormFooter>
                  {
                    loading ?
                      <FlexContainer>
                        <Spinner />
                      </FlexContainer> :
                      <Button type="submit" appearance="primary" shouldFitContainer spacing="default">Log In</Button>
                  }
                </FormFooter>
              </form>
            )}
          </Form>
      }
    </Container>
  )
};

export default Login;
