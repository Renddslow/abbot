import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import Label from './Label';
import { SyntheticEvent } from 'react';

type Props = {
  label: string;
  onChange: (value: string, e: SyntheticEvent<HTMLInputElement>) => void;
  value: string;
};

const FormControl = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: 8px;
`;

const InputStyled = styled.input`
  appearance: none;
  background: #fff;
  font-size: inherit;
  font-family: inherit;
  padding: 12px;
  border-radius: 4px;
  border: 2px solid #f2f2f2;
  outline: none;

  &:focus {
    border-color: #dd8876;
  }
`;

const Input = ({ label, onChange, value }: Props) => {
  const id = uuid();

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    onChange((e.target as HTMLInputElement).value, e);
  };

  return (
    <FormControl>
      <Label htmlFor={id}>{label}</Label>
      <InputStyled id={id} value={value} onChange={handleChange} />
    </FormControl>
  );
};

export default Input;
