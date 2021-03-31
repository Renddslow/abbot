import React from 'react';
import Spinner from '@atlaskit/spinner';
import { useQuery, gql } from '@apollo/client';
import {Route} from 'react-router-dom';

import Subheader from '../../components/Subheader';
import Section from '../../components/Section';
import Card from '../../components/Card';
import PageHeader from '../PageHeader';
import Grid from '../Grid';
import { RequestType } from '../../types';
import Request from '../Request';

const REQUESTS_QUERY = gql`
    query Requests {
        requests {
            id
            relationshipType
            created
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
  const requests: RequestType[] = data ? data.requests : [];

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
              {requests.slice().sort((a: RequestType, b: RequestType) => {
                  if (a.created > b.created) return 1;
                  if (a.created < b.created) return -1;
                  return 0;
              }).map((rel: RequestType) => (
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
        <Route path="/requests/:id" component={Request} />
    </>
  );
};

export default Requests;
