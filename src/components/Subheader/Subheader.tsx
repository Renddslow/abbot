import React from 'react';
import styled from 'styled-components';

type Props = {
  title: string;
};

const SubHeader = styled.header`
  background: #EE8AFB;
  padding: 24px;
  box-sizing: border-box;
  width: 100%;
  color: #fff;
`;

const Subheader = ({ title }: Props) => (
  <SubHeader>
    <h1>{title}</h1>
  </SubHeader>
);

export default Subheader;
