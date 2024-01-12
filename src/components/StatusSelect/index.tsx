import React from "react";
import Select, { StylesConfig, components } from "react-select";
import { SVGArrowDropDown } from "src/assets/images";

type ColourOption = {
  value: boolean;
  label: string;
  bgColor: string;
  color: string;
}
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
const dot = (bgColor = "transparent", color = "transparent") => ({
  alignItems: "center",
  display: "flex",
  backgroundColor: bgColor,
  borderRadius: "4px",
  padding: "4px 12px",
  justifyContent: "center",
  color: color,
});
const selectOptions = [
  {
    value: true,
    label: "Active",
    bgColor: "rgba(31, 168, 37, 0.14)",
    color: "#198a1e",
  },
  {
    value: false,
    label: "Inactive",
    bgColor: "rgba(223, 94, 78, 0.16)",
    color: "#df5e4e",
  },
];
const colourStyles: StylesConfig<ColourOption, false> = {
  menuList: (base) => ({
    ...base,
    padding: "0",
  }),
  indicatorsContainer: () => ({
    backgroundColor: "transparent",
  }),
  indicatorSeparator: () => ({ display: "none" }),

  control: (styles) => ({ ...styles, border: "none", boxShadow: "none" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
          ? data.bgColor
          : isFocused
            ? "#e8e6f9 !important"
            : undefined,
      color: isDisabled
        ? "#ccc"
        : isSelected
          ? "#fff"
          : isFocused
            ? "#434059"
            : "#2d2b3b",
      background: isDisabled ? "#ccc" : isSelected ? "#3528a5" : "#fff",
      cursor: isDisabled ? "not-allowed" : "default",
      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.bgColor
            : data.bgColor[3]
          : undefined,
      },
    };
  },
  input: (styles) => ({ ...styles, ...dot() }),
  placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
  singleValue: (styles, { data }) => ({
    ...styles,
    ...dot(data.bgColor, data.color),
  }),
};
type StatusSelectProps = {
  // selectOptions: ColourOption[]; // Define the type for selectOptions
  onselectionchange: (value: any) => void;
  defaultValue: boolean;
  className?: string;
  isDisabled?: boolean;
}
const StatusSelect: React.FC<StatusSelectProps> = ({
  onselectionchange,
  defaultValue,
  className = "",
  isDisabled = false
}) => {
  return (
    <div className={`status-option ${className}`}>
      <Select
        onChange={(value) => {
          onselectionchange(value);
        }}
        defaultValue={
          defaultValue === true ? selectOptions[0] : selectOptions[1]
        }
        options={selectOptions}
        styles={colourStyles}
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : null
        }
        menuPlacement="auto"
        components={{ DropdownIndicator }}
        isDisabled={isDisabled}
        classNamePrefix={isDisabled && "drp-status"}
      />
    </div>
  );
};

export default StatusSelect;
