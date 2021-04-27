import React, { useRef } from 'react';
import { useHistory } from 'react-router';
import { get } from 'dot-prop';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';
import Form, { Field } from '@atlaskit/form';
import Select from '@atlaskit/select';

import Modal from '../../components/Modal';
import Tag from '../../components/Tag';
import { Datetime, Row } from '../Request/styled';
import mentorFields from './mentorMeta';

type Props = {
  match: {
    params: { id: string };
  };
};

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const Column = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 8px;
`;

const REQUEST = gql`
  query Relationship($id: String!) {
    relationship(id: $id) {
      id
      created
      meta
      leader {
        id
        firstName
        lastName
        avatar
      }
      relationshipType
      individual {
        id
        firstName
        lastName
      }
    }
  }
`;

const makeTitle = (individual: Record<string, any>, leader: Record<string, any>) => {
  if (!individual.firstName || !leader.firstName) return '';
  return `${leader.firstName} ${leader.lastName} & ${individual.firstName} ${individual.lastName}`;
};

const Relationship = ({ match }: Props) => {
  const history = useHistory();
  const { data, loading } = useQuery(REQUEST, { variables: { id: match.params.id } });

  const individual: Record<string, any> = get(data, 'relationship.individual', {});
  const leader: Record<string, any> = get(data, 'relationship.leader', {});
  const meta = get(data, 'relationship.relationshipType') === 'mentoring' ? mentorFields : [];
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Modal
      ref={ref}
      title={makeTitle(individual, leader)}
      loading={loading}
      renderAside={() => <div />}
      renderActionRow={({ Link }) => (
        <Column>
          {!loading && (
            <Row>
              <Tag>{data.relationship.relationshipType || ''}</Tag>
              <Datetime title={get(data, 'relationship.created', '2020-01-01')}>
                Created{' '}
                {formatter.format(new Date(get(data, 'relationship.created', '2020-01-01')))}
              </Datetime>
            </Row>
          )}
          <Link
            href={`https://people.planningcenteronline.com/people/AC${get(
              data,
              'relationship.individual.id',
            )}`}
            target="_blank"
          >
            View Full Profile
          </Link>
        </Column>
      )}
      renderMetaRow={() => <div />}
      onExit={() => history.push('/relationships')}
    >
      <>
        {!loading && (
          <Form onSubmit={() => {}}>
            {({ formProps, getState }) => (
              <form {...formProps}>
                {meta.map((field) => (
                  <Field
                    label={field.label}
                    name={field.name}
                  >
                    {({ fieldProps }) =>
                      field.type === 'select' ? (
                        <>
                          {/* @ts-ignore */}
                          <Select
                            {...fieldProps}
                            // @ts-ignore
                            options={field.options}
                            closeMenuOnSelect
                            menuPortalTarget={ref.current}
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                          />
                        </>
                      ) : (
                        <div />
                      )
                    }
                  </Field>
                ))}
              </form>
            )}
          </Form>
        )}
      </>
    </Modal>
  );
};

export default Relationship;
