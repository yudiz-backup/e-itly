
import React, { useId, useRef } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function buttonWithTooltip(Button) {
  return function ButtonWithTooltip(props: ButtonProps) {
    const { tooltip, ...rest } = props;
    return (
      <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={<Tooltip>{tooltip}</Tooltip>}>
        <span>
          <Button {...rest} />
        </span>
      </OverlayTrigger>
    );
  };
}

function BasicButton(
  {
    title = "text",
    id,
    onClick = () => { },
    isLoading = false,
    testId = "button",
    fullWidth,
    variant,
    dataCy = "",
    icon,
    size = "large",
    className = "",
    disabled,
  }: ButtonProps
) {
  const btnWidth = fullWidth ? "w-100" : "";
  const ref = useRef()
  const uniqueId = useId();
  const btnId = id || "btn" + uniqueId;
  const buttonContent = (
    <>
      {icon && <img src={icon} alt="icon" />}
      {isLoading ? "Please wait" : title}
    </>
  );
  return (
    <button
      ref={ref}
      onClick={!isLoading ? onClick : undefined}
      data-testid={testId}
      id={btnId}
      className={`btn-${variant} ${btnWidth} btn-${size} ${className}`}
      data-cy={dataCy}
      disabled={disabled}
    >
      {buttonContent}
    </button>
  );
}

function Button(props: ButtonProps) {
  return props.tooltip ? buttonWithTooltip(BasicButton)(props) : <BasicButton {...props} />;
}

type ButtonProps = {
  title?: string;
  id?: string;
  onClick?: (event: MouseEvent) => void;
  isLoading?: boolean;
  testId?: string;
  fullWidth?: boolean;
  outline?: boolean;
  variant?: "primary" | "outline";
  dataCy?: string;
  icon?: string;
  size?: "medium" | "large";
  className?: string;
  disabled?: boolean;
  type?: string;
  tooltip?: string;
};

export default Button;
