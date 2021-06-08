import ReactSelect from 'react-select';

type Props = {
  options: { value: string; label: string }[];
};

const Select = (props: Props) => {
  return <ReactSelect options={props.options} />;
};

export default Select;
