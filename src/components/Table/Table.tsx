import {ReactChild, ReactElement} from 'react';
import styled from 'styled-components';
import {useLocation, useHistory} from 'react-router-dom';
import qs from 'qs';

import Pagination from '../Pagination';

export type Header = {
  label: string;
  key: string;
  type: 'person' | 'date' | 'label' | 'string';
  component?: (props: { children: ReactChild }) => ReactElement;
  filter?: boolean;
  center?: boolean;
};

type Data = { id: string } & Record<string, any>;

type Props = {
  title?: string;
  actionColumn?: boolean;
  headers: Header[];
  data: Data[];
  page?: number;
  active?: string;
} & ({
  hasNew?: false;
} | {
  hasNew: true;
  newLabel: string;
});

const TableHeader = styled.div`
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(2, minmax(0, max-content));
  align-items: center;
`;

const NewButton = styled.button`
  border: 0;
  background: #42275e;
  color: #feffff;
  font-size: inherit;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;
`;

const TableComponent = styled.table`
  width: 100%;
  margin-top: 24px;
  border-collapse: collapse;
  border-spacing: 0;
`;

const Column = styled.th<{ center?: boolean }>`
  text-align: ${({ center }) => center ? 'center' : 'left'};
  color: #717277;
  font-weight: 400;
  padding-left: 12px
`;

const Item = styled.td<{ center?: boolean }>`
  text-align: ${({ center }) => center ? 'center' : 'left'};
  font-size: 16px;
  color: #5d5e63;
  font-weight: 500;
  padding: 8px 0 8px 12px;
`;

const Row = styled.tr<{ active?: boolean }>`
  background: ${({ active }) => active ? `#fff` : 'transparent'};
  
  ${Item}:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
`;

const Table = (props: Props) => {
  const loc = useLocation();
  const history = useHistory();

  const { page: queryPage } = qs.parse(loc.search, { ignoreQueryPrefix: true });
  const page = parseInt(queryPage as string, 10) || 1;
  const pageStart = (page - 1) * 12;
  const pageEnd = pageStart + 12;
  const totalPages = Math.ceil(props.data.length / 12);

  return (
    <section>
      <TableHeader>
        {props.title ? <h2>{props.title}</h2> : <div /> }
        {
          props.hasNew ?
            <NewButton>{props.newLabel}</NewButton> :
            <div />
        }
      </TableHeader>
      <TableComponent>
        <thead>
          <tr>
            {props.headers.map((d) => (
              <Column center={d.center} key={d.label}>{d.label}</Column>
            ))}
            {props.actionColumn && <th />}
          </tr>
        </thead>
        <tbody>
          {
            props.data.slice(pageStart, pageEnd).map((d: Data) => (
              <Row active={props.active === d.id} key={d.id}>
                {
                  props.headers.map(({ center, key, component }) => (
                    <Item center={center} key={`${d.id}-${key}`}>
                      {component ? component({ children: d[key] }) : <span>{d[key]}</span>}
                    </Item>
                  ))
                }
              </Row>
            ))
          }
        </tbody>
      </TableComponent>
      <footer>
        <Pagination page={page} totalPages={totalPages} onClick={(v: number) => history.push(`?page=${v}`)} />
      </footer>
    </section>
  );
};

export default Table;
