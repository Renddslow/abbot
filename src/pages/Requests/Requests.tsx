import React from 'react';
import Spinner from '@atlaskit/spinner';

import Subheader from '../../components/Subheader';
import withAPI from '../../utils/withAPI';
import Section from '../../components/Section';
import Card from '../../components/Card';
import PageHeader from '../PageHeader';
import Grid from '../Grid';

type Data = {
  data: Array<{
    type: 'request';
    id: string;
    attributes: {
      assignment: {
        to: string | null;
        status: 'unassigned' | 'rejected' | 'pending';
      };
      created: string;
      relationshipType: 'coaching' | 'mentoring';
    };
    relationships: {
      individual: {
        data: {
          id: string;
          type: 'person';
          attributes: {
            avatar: string;
            firstName: string;
            lastName: string;
            name: string;
            email: string;
          };
        }
      }
    }
  }>;
};

type Props = {
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
