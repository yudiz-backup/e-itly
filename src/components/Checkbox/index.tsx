import { VNode } from "preact";
import React, { ChangeEvent } from "react";
import { Form } from "react-bootstrap";

const Checkbox = ({
  checked,
  label,
  disabled,
  onChange,
  size = "medium",
}: CheckboxProps): VNode<any> => {
  return (
    <Form.Group className="mb-3">
      <div className={`checkbox-w ${size}`}>
        <input
          id={label}
          name={label}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <Form.Label htmlFor={label}>{label}</Form.Label>
      </div>
    </Form.Group>
  );
};
type CheckboxProps = {
  checked?: boolean;
  label?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  size?: string;
};
export default Checkbox;

