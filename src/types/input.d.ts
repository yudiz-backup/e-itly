type inputType = "text" | "password" | "email" | "file" | "number" | "textarea";

type InputFieldType = {
  type?: inputType;
  value: string;
  key: string;
  name: string;
  placeHolder?: string;
  error: string;
  maxLength?: number;
  rules: string;
  dataCy?: string;
  disabled?: ?boolean;
  label?: ?string;
  accept?: string;
  file?: any;
  as?: string;
  style?: CSSProperties;
  options?: any;
  className?: string;
};
