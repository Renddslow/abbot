import React from 'react';
import Spinner from '@atlaskit/spinner';
import { RouteComponentProps } from 'react-router';

import Subheader from '../../components/Subheader';
import withAPI from '../../utils/withAPI';
import Section from '../../components/Section';
import Card from '../../components/Card';
import PageHeader from '../PageHeader';
import Grid from '../Grid';
import { RequestType } from '../../types';

type Data = {
  data: Array<RequestType>;
};

type Props = RouteComponentProps<{
  id: string;
}> & {
  data: Data; // TODO: type this
  loading: boolean;
};

const Requests = ({ data, loading }: Props) => {
  return (
    <>
      <Subheader title="Requests" />
      <Section>
        {loading ? (
          <div>
            <Spinner size="xlarge" />
          </div>
        ) : (
          <>
            <PageHeader createLabel="Request" length={data.data.length} />
            <Grid>
              {data.data.map((rel) => (
                <Card
                  key={rel.id}
                  participant={rel.relationships.individual}
                  relationshipType={rel.attributes.relationshipType}
                  to={`/requests/${rel.id}`}
                />
              ))}
            </Grid>
          </>
        )}
      </Section>
    </>
  );
};

export default withAPI(Requests, {
  route: 'requests',
  method: 'GET',
});
