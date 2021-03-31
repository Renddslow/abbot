import styled from 'styled-components';

const ListItem = styled.li<{ completed?: boolean }>`
  margin-bottom: 12px;
  position: relative;
  z-index: 0;

  &::before {
    content: ${(props) => (props.completed ? '"✓"' : '""')};
    width: 12px;
    height: 12px;
    border: 2px solid ${(props) => (props.completed ? '#36B37E' : '#ccc')};
    display: flex;
    border-radius: 50%;
    position: absolute;
    left: -22px;
    top: 3px;
    background: ${(props) => (props.completed ? '#36B37E' : '#fff')};
    z-index: -1;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 600;
  }

  &:not(:last-child)::after {
    content: '';
    height: calc(100% + 12px);
    top: 6px;
    width: 2px;
    background: ${(props) => (props.completed ? 'linear-gradient(#36B37E 60%, #ccc 60%)' : '#ccc')};
    display: block;
    position: absolute;
    left: -15px;
    z-index: -2;
  }
`;

export default ListItem;
