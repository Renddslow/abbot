import Textfield from '@atlaskit/textfield';
import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';

type Props = {
  length: number;
  createLabel?: string;
  onCreate?: (e: SyntheticEvent) => void;
};

const Count = styled.p`
  font-size: 20px;
  letter-spacing: -0.0125em;
  color: #525150;
  font-family: inherit;
  font-weight: normal;
  font-style: normal;
  text-rendering: optimizeLegibility;
  line-height: 1.4;
`;

const Search = styled.div`
  margin: 12px 0;
  width: 100%;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, max-content));
  align-items: center;
  justify-content: space-between;
`;

const PageHeader = ({ length, onCreate, createLabel }: Props) => (
  <>
    <Header>
      <Count>
        {length} {createLabel}{length > 1 ? 's' : ''}
      </Count>
      { !!onCreate && <button onClick={onCreate}>New {createLabel}</button>}
    </Header>
    <Search>
      <Textfield placeholder="Filter" />
    </Search>
  </>
);

export default PageHeader;
