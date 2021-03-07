import React from 'react';
import Spinner from '@atlaskit/spinner';

import Subheader from '../../components/Subheader';
import api from '../../utils/api';
import Section from '../../components/Section';
import Card from '../../components/Card';
import PageHeader from '../PageHeader';
import Grid from '../Grid';

type Person = {
  type: 'person';
  id: string;
  attributes: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

type Data = {
  data: Array<{
    type: 'relationship';
    id: string;
    attributes: {
      relationshipType: 'mentoring' | 'coaching';
    };
    relationships: {
      leader: {
        data: Person;
      };
      individual: {
        data: Person;
      };
    };
  }>;
};

type Props = {
  data: Data; // TODO: type this
  loading: boolean;
};

const Relationships = ({ data, loading }: Props) => {
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
            <PageHeader createLabel="Relationship" length={data.data.length} onCreate={() => {}} />
            <Grid>
              {data.data.map((rel) => (
                <Card
                  key={rel.id}
                  to={`/relationships/${rel.id}`}
                  leader={rel.relationships.leader}
                  participant={rel.relationships.individual}
                  relationshipType={rel.attributes.relationshipType}
                />
              ))}
            </Grid>
          </>
        )}
      </Section>
    </>
  );
};

export default api(Relationships, {
  route: 'relationships',
  method: 'GET',
});
