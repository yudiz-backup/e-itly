import React, { CSSProperties, useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";

import { iconEyeFill, iconEyeSlashFill } from "src/assets/images";
function TextField({
  type = "text",
  value = "",
  error = "",
  eyeIcon,
  name,
  label,
  removeSpacing = "mb-3",
  onChange = () => { },
  onKeyPress = () => { },
  placeHolder = "",
  dataCy,
  as,
  id,
  style,
  disabled,
  className,
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const showPasswordHandle = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Form.Group className={removeSpacing}>
      <FloatingLabel label={label}>
        <Form.Control
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          name={name}
          onInput={(e: any) => onChange(e.target?.value)}
          placeholder={placeHolder}
          onKeyPress={(e: any) => onKeyPress(e)}
          noValidate
          autoComplete="off"
          data-cy={dataCy}
          id={id}
          as={as}
          style={style}
          disabled={disabled}
          className={className}
        />
        {eyeIcon ? (
          <button
            onClick={showPasswordHandle}
            className="password-eyeIcon"
            type="button"
            data-cy="eyeIcon"
          >
            <img
              src={!showPassword ? iconEyeSlashFill : iconEyeFill}
              alt="icon"
            />
          </button>
        ) : (
          ""
        )}
      </FloatingLabel>
      <Form.Control.Feedback type="invalid" data-cy={dataCy + "Error"}>
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

type TextFieldProps = {
  type?: inputType;
  name?: string;
  value?: string | number;
  error?: string;
  onChange?: (value: string) => void;
  onKeyPress?: (value: string) => void;
  placeHolder?: string;
  eyeIcon?: boolean;
  label?: React.ReactNode;
  dataCy?: string;
  id?: string;
  as?: string;
  style?: CSSProperties;
  removeSpacing?: string;
  disabled?: boolean;
  className?: string;
};
export default TextField;
