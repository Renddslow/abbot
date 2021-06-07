import styled from 'styled-components';

type Props = {
  children: string;
};

const Header = styled.header`
  display: block;

  h1 {
    font-size: 32px;
  }
`;

const PageHeader = ({ children }: Props) => (
  <Header>
    <h1>{children}</h1>
  </Header>
);

export default PageHeader;
