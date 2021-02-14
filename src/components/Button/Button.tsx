import styled from 'styled-components';

const Button = styled.button<{ blackText?: boolean, background: string }>`
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid ${props => props.background};
  box-sizing: border-box;
  display: block;
  width: max-content;
  text-decoration: none;
  color: ${props => props.blackText ? '#000' : '#fff'};
  cursor: pointer;
  background: ${props => props.background};
  appearance: none;
  font-size: 1em;
`;

export default Button;
