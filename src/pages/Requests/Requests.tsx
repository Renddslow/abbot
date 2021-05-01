import React, { useState } from 'react';
import Spinner from '@atlaskit/spinner';
import { useQuery, gql } from '@apollo/client';
import { Route } from 'react-router-dom';
import { get } from 'dot-prop';

import Subheader from '../../components/Subheader';
import Section from '../../components/Section';
import Card from '../../components/Card';
import PageHeader from '../PageHeader';
import Grid from '../Grid';
import { RequestType } from '../../types';
import Request from '../Request';
import filterResults, { Keys } from '../../utils/filterResults';
import Results from '../../components/Results';

const excludedPaths = [
  '__typename',
  'individual.firstName',
  'individual.lastName',
  'individual.avatar',
  'individual.__typename',
  'leader.__typename',
  'leader.avatar',
  'relationshipType',
];

const getKey = (k: string): string => {
  switch (k) {
    case 'id':
      return 'Request ID';
    case 'created':
      return 'Created';
    case 'individual.id':
      return 'PCO ID';
    case 'leader.firstName':
      return 'Leader';
    case 'leader.lastName':
      return 'Leader';
    case 'leader.id':
      return 'Leader ID';
    default:
      return '';
  }
};

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const getValue = (k: string, v: any, data: RequestType) => {
  if (k.includes('leader') && k.includes('Name'))
    return `${data.leader.firstName} ${data.leader.lastName}`;
  if (k === 'created') return formatter.format(new Date(v));
  return v;
};

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
  const [filter, setFilter] = useState('');
  const { data, loading } = useQuery(REQUESTS_QUERY);
  const requests: RequestType[] = data ? data.requests : [];

  const filteredRequests = filterResults<RequestType>(filter, requests);

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
            <PageHeader
              createLabel="Request"
              length={requests.length}
              filter={filter}
              onFilterChange={(e) => {
                // @ts-ignore
                setFilter(e.target.value);
              }}
            />
            <Grid>
              {filteredRequests
                .slice()
                .sort((a: [Keys | null, RequestType], b: [Keys | null, RequestType]) => {
                  const [, aReq] = a;
                  const [, bReq] = b;
                  if (aReq.created > bReq.created) return 1;
                  if (aReq.created < bReq.created) return -1;
                  return 0;
                })
                .map((rel: [Keys | null, RequestType]) => (
                  <Card
                    key={rel[1].id}
                    participant={rel[1].individual}
                    relationshipType={rel[1].relationshipType}
                    to={`/requests/${rel[1].id}`}
                  >
                    <Results>
                      {(rel[0] || [])
                        .filter((k) => !excludedPaths.includes(k.path))
                        .map((k, idx) => ({
                          key: getKey(k.path),
                          value: getValue(k.path, get(rel[1], k.path, ''), rel[1]),
                        }))}
                    </Results>
                  </Card>
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
