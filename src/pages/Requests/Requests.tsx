import React from 'react';
import Spinner from '@atlaskit/spinner';
import { useQuery, gql } from '@apollo/client';

import Subheader from '../../components/Subheader';
import Section from '../../components/Section';
import Card from '../../components/Card';
import PageHeader from '../PageHeader';
import Grid from '../Grid';
import { RequestType } from '../../types';

const REQUESTS_QUERY = gql`
    query Requests {
        requests {
            id
            relationshipType
            individual {
                id
                firstName
                lastName
                avatar
            }
            leader {
                id
                firstName
                lastName
                avatar
            }
        }
    }
`;

const Requests = () => {
  const { data, loading } = useQuery(REQUESTS_QUERY);
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
            <PageHeader createLabel="Request" length={data.requests.length} />
            <Grid>
              {data.requests.map((rel: RequestType) => (
                <Card
                  key={rel.id}
                  participant={rel.individual}
                  relationshipType={rel.relationshipType}
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

export default Requests;
