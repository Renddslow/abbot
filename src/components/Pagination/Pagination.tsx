import styled from 'styled-components';
import pagr from 'pagr';

type Props = {
  page: number;
  totalPages: number;
  onClick: (page: number) => void;
};

const Nav = styled.nav`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  width: max-content;
  grid-gap: 4px;
  margin: 24px auto 0;
`;

const Button = styled.button<{ current: boolean }>`
  font-size: 14px;
  border: 0;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ current }) => (current ? '#fc795f' : 'transparent')};
  color: ${({ current }) => (current ? '#feecde' : 'inherit')};
  cursor: pointer;
  border-radius: 8px;
`;

const Separator = styled.span`
  font-size: 14px;
  border: 0;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Chevron = styled.button.attrs({
  className: 'material-icons',
})`
  font-size: 18px;
  border: 0;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fc795f;
  cursor: pointer;
  background: transparent;

  &:disabled {
    color: #baa;
    cursor: auto;
  }
`;

const Pagination = (props: Props) => {
  const pages = pagr(props.page - 1, props.totalPages, 5);

  return (
    <Nav>
      <Chevron onClick={() => props.onClick(props.page - 1)} disabled={props.page === 1}>
        chevron_left
      </Chevron>
      {pages.map((page, idx) =>
        page.type === 'page' ? (
          <Button key={page.page} onClick={() => props.onClick(page.page)} current={!!page.current}>
            {page.page}
          </Button>
        ) : (
          <Separator key={`sep-${idx}`}>...</Separator>
        ),
      )}
      <Chevron
        onClick={() => props.onClick(props.page + 1)}
        disabled={props.page === props.totalPages}
      >
        chevron_right
      </Chevron>
    </Nav>
  );
};

export default Pagination;
