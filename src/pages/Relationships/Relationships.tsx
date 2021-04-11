import React from 'react';
import Spinner from '@atlaskit/spinner';
import { useQuery, gql } from '@apollo/client';

import Subheader from '../../components/Subheader';
import Section from '../../components/Section';
import Card from '../../components/Card';
import PageHeader from '../PageHeader';
import Grid from '../Grid';

const RELATIONSHIPS = gql`
    query GetRelationships {
        relationships {
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

const Relationships = () => {
  const { data, loading } = useQuery(RELATIONSHIPS);

  return (
    <>
      <Subheader title="Relationships" />
      <Section>
        {loading ? (
          <div>
            <Spinner size="xlarge" />
          </div>
        ) : (
          <>
            <PageHeader createLabel="Relationship" length={data.relationships.length} onCreate={() => {}} />
            <Grid>
              {data.relationships.map((relationship: Record<string, any>) => (
                <Card
                  key={relationship.id}
                  to={`/relationships/${relationship.id}`}
                  leader={relationship.leader}
                  participant={relationship.individual}
                  relationshipType={relationship.relationshipType}
                />
              ))}
            </Grid>
          </>
        )}
      </Section>
    </>
  );
};

export default Relationships;
