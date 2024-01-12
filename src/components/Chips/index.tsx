import { VNode } from "preact";
import React from "react";
import { Badge } from "react-bootstrap";
import { SvgClose } from "src/assets/images";

const Chips = ({
  title,
  size = "large",
  closeIcon,
  onClick = () => { },
}: ChipsProps): VNode<any> => {
  return (
    <div className="chips">
      <Badge className={`badge-${size}`}>{title}</Badge>
      <button onClick={onClick}>{closeIcon && <SvgClose size="20" />}</button>
    </div>
  );
};

type ChipsProps = {
  title: string;
  className?: string;
  closeIcon?: boolean;
  onClick?: (event: MouseEvent) => void;
  size?: "medium" | "large";
};
export default Chips;
