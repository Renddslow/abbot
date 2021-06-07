import {
  createContext,
  ReactChild,
  ReactElement,
  useState,
  useContext,
  SyntheticEvent,
} from 'react';

type Checkboxes = {
  values: Record<string, boolean>;
  update: (id: string, value: boolean) => void;
};

type Props = {
  ids: string[];
  children: ReactChild;
};

const CheckboxesContext = createContext<Checkboxes>({} as Checkboxes);

const CheckboxesProvider = (props: Props) => {
  const [values, setValues] = useState<Record<string, boolean>>(props.ids.reduce((acc, id) => ({ ...acc, [id]: false }), {}));

  const update = (id: string, value: boolean) => setValues((t) => ({ ...t, [id]: value }));

  return (
    <CheckboxesContext.Provider
      value={{
        values,
        update,
      }}
    >
      {props.children}
    </CheckboxesContext.Provider>
  );
};

export function withCheckboxes<ComponentProps>(
  Component: (
    props: {
      id: string;
      checked: boolean;
      onChange: (checked: boolean, e: SyntheticEvent) => void;
    } & ComponentProps,
  ) => ReactElement,
) {
  return function (props: { id: string, children: ReactChild } & ComponentProps) {
    const { values, update } = useContext(CheckboxesContext);

    const handleChange = (v: boolean, e: SyntheticEvent) => {
      update(props.id, v);
    };

    return (
      <Component
        checked={values[props.id]}
        onChange={handleChange}
        {...props}
      />
    );
  };
}

export default CheckboxesProvider;
