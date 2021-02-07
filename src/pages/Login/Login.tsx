import styled from 'styled-components';
import Form, {Field, FormFooter} from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import {useState} from 'react';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin: 0 auto 24px;
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

const Login = () => {
  const [linkSent, setLinkSent] = useState(false);

  const onSubmit = async (state: any) => {
    const res =await fetch('https://abbot-api-auevpolm5q-uc.a.run.app/session', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'session',
          attributes: {
            email: state.email,
          },
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((d) => d.json());
    setLinkSent(res.meta.message);
  };

  return (
    <Container>
      <div>
        <div>Log in to continue to:</div>
        <div>Relationships</div>
      </div>
      {
        linkSent ?
          <div>{linkSent}</div> :
          <Form onSubmit={onSubmit}>
            {({ formProps, submitting}) => (
              <form {...formProps}>
                <Field label="Email Address" defaultValue="" name="email" isDisabled={submitting}>
                  {({ fieldProps }) => (
                    <Textfield {...fieldProps} />
                  )}
                </Field>
                <FormFooter>
                  {
                    submitting ?
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
