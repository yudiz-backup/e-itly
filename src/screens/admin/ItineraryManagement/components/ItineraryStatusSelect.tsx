import React from "react";
import Select, { StylesConfig, components } from "react-select";
import { SVGArrowDropDown } from "src/assets/images";
import { selectItineraryStatusOptions } from "src/constants/generics";

type ColorOption = {
  value: string;
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
  textAlign: "center" as const,
  whiteSpace: "initial" as const,
  justifyContent: "center",
  color: color,
});

const colourStyles: StylesConfig<ColorOption, false> = {
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
  // selectOptions: ColorOption[]; // Define the type for selectOptions
  onselectionchange: (value: any) => void;
  defaultValue: string;
  className?: string;
  isDisabled?: boolean;
}
const ItineraryStatusSelect: React.FC<StatusSelectProps> = ({
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
          defaultValue
            ? selectItineraryStatusOptions?.find((item) => item?.value === defaultValue)
            : selectItineraryStatusOptions[0]
        }
        options={selectItineraryStatusOptions}
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

export default ItineraryStatusSelect;
