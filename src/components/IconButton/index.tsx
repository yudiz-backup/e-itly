import { VNode } from "preact";
import React from "react";
const IconButton = ({
  icon,
  className,
  onClick = () => { },
}: IconButtonProps): VNode<any> => {
  return (
    <button className={`icon-btn ${className}`} onClick={onClick}>
      <img src={icon} alt="icon" />
    </button>
  );
};

type IconButtonProps = {
  className?: string;
  icon: string;
  onClick?: (event: MouseEvent) => void;
};
export default IconButton;
