import React from "react";
import { SvgCloseProps } from "./close";
type SVGArrowDownProps = SvgCloseProps & {
  className?: string;
  style?: string | React.JSX.CSSProperties | React.JSX.SignalLike<string | React.JSX.CSSProperties>;
};
const SVGArrowDown = ({ size = "30", className = "", style = "" }: SVGArrowDownProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" style={style}>
        <path
          d="M6.7002 15.3002C6.88353 15.4835 7.11686 15.5752 7.4002 15.5752C7.68353 15.5752 7.91686 15.4835 8.10019 15.3002L12.0002 11.4002L15.9002 15.3002C16.0835 15.4835 16.3169 15.5752 16.6002 15.5752C16.8835 15.5752 17.1169 15.4835 17.3002 15.3002C17.4835 15.1169 17.5752 14.8835 17.5752 14.6002C17.5752 14.3169 17.4835 14.0835 17.3002 13.9002L12.7002 9.3002C12.6002 9.2002 12.4919 9.12936 12.3752 9.0877C12.2585 9.04603 12.1335 9.0252 12.0002 9.0252C11.8669 9.0252 11.7419 9.04603 11.6252 9.0877C11.5085 9.12936 11.4002 9.2002 11.3002 9.3002L6.7002 13.9002C6.51686 14.0835 6.42519 14.3169 6.42519 14.6002C6.42519 14.8835 6.51686 15.1169 6.7002 15.3002Z"
          fill="currentColor"
        />
    </svg>
  );
};

export default SVGArrowDown;
