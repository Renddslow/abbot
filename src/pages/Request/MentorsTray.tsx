import styled from 'styled-components';
import Spinner from '@atlaskit/spinner';

import withPagination from '../../utils/withPagination';
import {Person} from '../../types';

type Props = {
  data: {
    data: Array<Person>;
  };
  loading: boolean;
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: 12px;
`;

const MentorsTray = (props: Props) => {
  return (
    props.loading ?
      <Spinner /> :
      <Grid>
        {
          props.data.data.map((person) => (
            <div>{person.attributes.name}</div>
          ))
        }
      </Grid>
  );
};

export default withPagination(MentorsTray, {
  route: ({ relationshipType }) => relationshipType === 'mentoring' ? 'mentors' : 'coaches',
  method: 'GET',
});
