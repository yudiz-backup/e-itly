import { VNode } from "preact";
import React from "react";

type SvgCheckFillProps = SvgCloseProps & {
  className?: string;
  style?: string | React.JSX.CSSProperties | React.JSX.SignalLike<string | React.JSX.CSSProperties>;
};
const SvgCheckFill = ({ size = "16", className = "", style = "" }: SvgCheckFillProps): VNode<any> => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" className={className} fill="none" style={style}>
      <path
        d="M8 0.5C3.85775 0.5 0.5 3.85775 0.5 8C0.5 12.1423 3.85775 15.5 8 15.5C12.1423 15.5 15.5 12.1423 15.5 8C15.5 3.85775 12.1423 0.5 8 0.5ZM6.5 12.0605L2.96975 8.53025L4.03025 7.46975L6.5 9.9395L11.9697 4.46975L13.0303 5.53025L6.5 12.0605Z"
        fill="currentColor"
      />
    </svg>
  );
};
export type SvgCloseProps = {
  size?: string;
};
export default SvgCheckFill;
