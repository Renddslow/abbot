type BaseField = {
  name: string;
  label: string;
};

type SelectField = BaseField & {
  type: 'select';
  options: Array<{ label: string; value: string }>;
};

type TextField = BaseField & {
  type: 'text';
}

export type MetaField = SelectField | TextField;

const metaFields: MetaField[] = [
  {
    name: 'course',
    label: 'Mentorship Material',
    type: 'select',
    options: [
      { label: 'Purpose-Driven Life', value: '6w' },
      { label: 'Multiply', value: '24w' },
      { label: '48-week Material', value: '48w' },
    ],
  },
];

export default metaFields;
