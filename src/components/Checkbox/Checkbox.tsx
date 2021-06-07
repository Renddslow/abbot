import styled from 'styled-components';
import { SyntheticEvent } from 'react';
import { v4 as uuid } from 'uuid';

type Props = {
  checked?: boolean;
  onChange: (checked: boolean, e: SyntheticEvent) => void;
  label: string;
  labelHidden: boolean;
};

const Check = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
  </svg>
);

const Box = styled.div`
  display: block;
  width: 16px;
  height: 16px;
  background: transparent;
  border: 2px solid #a3a3ad;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  
  svg {
    width: 100%;
    position: absolute;
    top: 0;
    fill: #fff;
    opacity: 0;
  }
`;

const HiddenInput = styled.input`
  display: none;

  &:checked ~ ${Box} {
    border-color: #462d60;
    background: #462d60;
  }
  
  &:checked ~ ${Box} svg {
    opacity: 1;
  }
`;

const Checkbox = (props: Props) => {
  const inputProps: Record<string, any> = {};
  const id = uuid();

  if (props.labelHidden) {
    inputProps['aria-label'] = props.label;
  } else {
    inputProps['aria-describedby'] = id.current;
  }

  const onChange = (e: SyntheticEvent) => {
    props.onChange((e.target as HTMLInputElement).checked, e);
  };

  return (
    <label>
      <HiddenInput type="checkbox" {...inputProps} checked={!!props.checked} onChange={onChange} />
      <Box>
        {
          !!props.checked &&
            <Check />
        }
      </Box>
      {
        !props.labelHidden &&
        <span id={id.current}>{props.label}</span>
      }
    </label>
  );
};

export default Checkbox;
