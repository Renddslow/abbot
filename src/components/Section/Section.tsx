import styled from 'styled-components';

type Props = {
  children: JSX.Element;
};

const Page = styled.section`
  background: #ebedf2;
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - 130px);
  padding: 48px 24px;
`;

const Section = ({ children }: Props) => (
  <Page>{children}</Page>
);

export default Section;
