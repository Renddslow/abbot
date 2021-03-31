import styled from 'styled-components';
import {TagRaw} from '../../../components/Tag/Tag';

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, max-content));
  grid-gap: 8px;
  align-items: center;

  ${TagRaw} {
    margin-top: 0;
  }
`;

export default Row;

