import React from "react";
import { Form } from "react-bootstrap";
import Select, {
  OptionsOrGroups,
  ActionMeta,
  OnChangeValue,
  PropsValue,
  GetOptionLabel,
  GetOptionValue,
  components,
} from "react-select";
import { SVGArrowDropDown } from "src/assets/images";

export const SELECT_CLASSES = {
  control: {
    base: "form-control",
    focused: "form-control-active",
  },
  option: {
    focused: "focus-item",
  },
};

export const SELECT_CLASSNAMES = {
  control: (state: any) => {
    let classes = SELECT_CLASSES.control.base + " base-input";
    if (state.isFocused) {
      classes += " " + SELECT_CLASSES.control.focused;
    }
    return classes;
  },
  menuList: () => "react-menu-list",
  indicatorSeparator: () => "d-none",
  option: (state: any) => {
    let classes = SELECT_CLASSES.control.base;
    if (state.isFocused) {
      classes = SELECT_CLASSES.option.focused;
    }
    return classes;
  },
};
const CaretDownIcon = () => {
  return <SVGArrowDropDown />;
};

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretDownIcon />
    </components.DropdownIndicator>
  );
};
function CustomSelect<T>({
  id,
  value,
  error,
  dataCy,
  options,
  onChange,
  placeholder,
  isClearable = false,
  isMulti = false,
  getOptionLabel,
  getOptionValue,
  className = "",
}: CustomSelectProps<T>) {
  return (
    <Form.Group data-cy={dataCy}>
      <Select
        id={id}
        value={value}
        isMulti={isMulti}
        options={options}
        isClearable={isClearable}
        className={`select ${className}`}
        onChange={onChange}
        placeholder={placeholder}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        classNames={{ ...SELECT_CLASSNAMES }}
        components={{ DropdownIndicator }}
      />
      {error && (
        <Form.Control.Feedback type="invalid" data-cy={dataCy + "Error"}>
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}

export type GroupBase<Option> = {
  readonly options: readonly Option[];
  readonly label?: string;
}

type IsMulti = boolean;
type CustomSelectProps<T> = {
  id?: string;
  error?: string;
  dataCy?: string;
  className?: string;
  options: OptionsOrGroups<T, GroupBase<T>>;
  value?: PropsValue<T>;
  onChange: (
    newValue: OnChangeValue<T, IsMulti>,
    actionMeta: ActionMeta<T>
  ) => void;
  placeholder?: string;
  isMulti?: IsMulti;
  isClearable?: boolean;
  getOptionLabel: GetOptionLabel<T>;
  getOptionValue: GetOptionValue<T>;
}

export default CustomSelect;
